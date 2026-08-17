import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectToDatabase from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "month";

    let dateQuery = {};
    const now = new Date();
    
    if (filter === "week") {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateQuery = { date: { $gte: lastWeek } };
    } else if (filter === "month") {
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateQuery = { date: { $gte: lastMonth } };
    } else if (filter === "year") {
      const lastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      dateQuery = { date: { $gte: lastYear } };
    }

    const transactions = await Transaction.find({ 
      userId: (session.user as any).id,
      ...dateQuery
    }).sort({ date: -1 });

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (tx.type === "income") {
        totalIncome += tx.amount;
      } else if (tx.type === "expense") {
        totalExpense += tx.amount;
      }
    });

    const totalBalance = totalIncome - totalExpense;

    return NextResponse.json({
      transactions,
      summary: {
        totalIncome,
        totalExpense,
        totalBalance,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, amount, type, category, date } = await req.json();

    if (!title || !amount || !type || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const newTransaction = new Transaction({
      userId: (session.user as any).id,
      title,
      amount: Number(amount),
      type,
      category,
      date: date ? new Date(date) : new Date(),
    });

    await newTransaction.save();

    return NextResponse.json({ message: "Transaction added successfully", transaction: newTransaction }, { status: 201 });
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

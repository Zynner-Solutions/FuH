import { useAuthStore } from "@/lib/store/AuthStore";
import { useEffect, useState } from "react";
import { useExpenses } from "@/lib/hooks/useExpenses";

export function useProfileStats() {
  const { user } = useAuthStore();
  const { expenses } = useExpenses();
  const [loading, setLoading] = useState(true);
  const [expenseCount, setExpenseCount] = useState(0);
  const [mostUsedCategory, setMostUsedCategory] = useState("");
  const [daysOfUse, setDaysOfUse] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      setLoading(true);
      setExpenseCount(expenses?.length || 0);

      const categoryCount: Record<string, number> = {};
      expenses?.forEach((e) => {
        categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
      });
      let most = "";
      let max = 0;
      Object.entries(categoryCount).forEach(([cat, count]) => {
        if (count > max) {
          most = cat;
          max = count;
        }
      });
      setMostUsedCategory(most);

      let createdDate: Date | null = null;
      if (expenses.length > 0) {
        const sorted = [...expenses].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        createdDate = new Date(sorted[0].created_at);
      }
      const now = new Date();
      if (createdDate) {
        const diff =
          Math.floor(
            (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;
        setDaysOfUse(diff);
      } else {
        setDaysOfUse(1);
      }
      setLoading(false);
    }
    fetchStats();
  }, [user]);

  return { loading, expenseCount, mostUsedCategory, daysOfUse };
}

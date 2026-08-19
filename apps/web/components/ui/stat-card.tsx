"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  trendDirection?: "up" | "down"
  description?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendDirection,
  description,
  className,
}: StatCardProps) {
  const isPositive = trendDirection === "up"

  return (
    <Card className={cn("overflow-hidden glass-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                {trend !== undefined && (
                  <span
                    className={cn(
                      "flex items-center text-xs font-medium",
                      isPositive ? "text-success" : "text-destructive"
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(trend)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {description && (
          <p className="mt-4 text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

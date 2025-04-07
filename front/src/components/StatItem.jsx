export function StatItem({ icon, title, description, value }) {
    return (
      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            {icon}
          </div>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
    );
  }
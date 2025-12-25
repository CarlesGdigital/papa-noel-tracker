import { useChecklistStore } from '@/lib/checklistStore';

interface ReyesChecklistProps {
  profileId: string;
}

export function ReyesChecklist({ profileId }: ReyesChecklistProps) {
  const { getChecklist, toggleItem } = useChecklistStore();
  const items = getChecklist(profileId);

  const completedCount = items.filter(item => item.checked).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="glass rounded-2xl p-4 w-72">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">✅</span>
        <h3 className="font-fredoka text-snow">Checklist de Reyes</h3>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{completedCount}/{items.length} completado</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-reyes-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(profileId, item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
              item.checked 
                ? 'bg-reyes-gold/20 text-snow' 
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
              item.checked 
                ? 'bg-reyes-gold border-reyes-gold' 
                : 'border-muted-foreground'
            }`}>
              {item.checked && <span className="text-xs text-accent-foreground">✓</span>}
            </div>
            <span className={`text-sm ${item.checked ? 'line-through opacity-70' : ''}`}>
              {item.label}
            </span>
            {item.checked && <span className="ml-auto">✨</span>}
          </button>
        ))}
      </div>

      {completedCount === items.length && (
        <div className="mt-3 p-3 bg-reyes-gold/30 rounded-xl text-center">
          <p className="text-sm font-fredoka text-reyes-gold">
            🎉 ¡Todo listo para los Reyes!
          </p>
        </div>
      )}
    </div>
  );
}

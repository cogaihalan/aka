"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { MenuItem } from "@/types/menu";

interface SortableMenuItemFormProps {
  item: MenuItem;
  sectionId: string;
  categoryId: string;
  onUpdate: (updates: Partial<MenuItem>) => void;
  onDelete: () => void;
  onMoveToCategory: (
    activeId: string, 
    overId: string, 
    targetSectionId: string,
    targetCategoryId: string
  ) => void;
}

export function SortableMenuItemForm({ 
  item, 
  sectionId, 
  categoryId, 
  onUpdate, 
  onDelete,
  onMoveToCategory 
}: SortableMenuItemFormProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: "MenuItem",
      item,
      sectionId,
      categoryId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-muted/50 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <div className="space-y-2 flex-1">
            <Label htmlFor={`item-label-${item.id}`}>Label</Label>
            <Input
              id={`item-label-${item.id}`}
              value={item.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Item label"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`item-href-${item.id}`}>URL</Label>
          <Input
            id={`item-href-${item.id}`}
            value={item.href}
            onChange={(e) => onUpdate({ href: e.target.value })}
            placeholder="/item-url"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`item-description-${item.id}`}>Description</Label>
          <Input
            id={`item-description-${item.id}`}
            value={item.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Item description"
          />
        </div>
        <div className="flex justify-end items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

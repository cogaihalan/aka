"use client";

import { useSortable } from "@dnd-kit/sortable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { MenuCategory, MenuItem } from "@/types/menu";
import { SortableMenuItemForm } from "./sortable-menu-item-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SortableCategoryFormProps {
  category: MenuCategory;
  sectionId: string;
  onUpdate: (updates: Partial<MenuCategory>) => void;
  onDelete: () => void;
  onAddItem: () => void;
  onUpdateItem: (itemId: string, updates: Partial<MenuItem>) => void;
  onDeleteItem: (itemId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  onReorderItems: (activeId: string, overId: string) => void;
  onMoveItemBetweenCategories: (
    activeId: string, 
    overId: string, 
    targetSectionId: string,
    targetCategoryId: string
  ) => void;
}

export function SortableCategoryForm({
  category,
  sectionId,
  onUpdate,
  onDelete,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  isExpanded,
  onToggle,
  onReorderItems,
  onMoveItemBetweenCategories,
}: SortableCategoryFormProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
    data: {
      type: "Category",
      category,
      sectionId,
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
      className={`p-4 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <Label className="font-medium">{category.title}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddItem}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <Label htmlFor={`category-title-${category.id}`}>Category Title</Label>
        <Input
          id={`category-title-${category.id}`}
          value={category.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Enter category title"
        />
      </div>

      <Collapsible open={isExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )}
            Menu Items ({category.items.length})
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          <SortableContext 
            items={category.items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {category.items.map((item) => (
              <SortableMenuItemForm
                key={item.id}
                item={item}
                sectionId={sectionId}
                categoryId={category.id}
                onUpdate={(updates) => onUpdateItem(item.id, updates)}
                onDelete={() => onDeleteItem(item.id)}
                onMoveToCategory={(activeId, overId, targetSectionId, targetCategoryId) =>
                  onMoveItemBetweenCategories(activeId, overId, targetSectionId, targetCategoryId)
                }
              />
            ))}
          </SortableContext>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

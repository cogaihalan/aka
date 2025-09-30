"use client";

import { useSortable } from "@dnd-kit/sortable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Menu, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { MenuSection } from "@/types/menu";
import {SortableCategoryForm} from "./sortable-category-form";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";

interface SortableSectionFormProps {
  section: MenuSection;
  onUpdate: (updates: Partial<MenuSection>) => void;
  onDelete: () => void;
  onAddCategory: () => void;
  onUpdateCategory: (categoryId: string, updates: Partial<any>) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddMenuItem: (categoryId: string) => void;
  onUpdateMenuItem: (categoryId: string, itemId: string, updates: Partial<any>) => void;
  onDeleteMenuItem: (categoryId: string, itemId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  expandedCategories: Set<string>;
  onToggleCategory: (categoryId: string) => void;
  onReorderCategories: (activeId: string, overId: string) => void;
  onMoveCategoryBetweenSections: (activeId: string, overId: string, targetSectionId: string) => void;
  onReorderMenuItems: (categoryId: string, activeId: string, overId: string) => void;
  onMoveMenuItemBetweenCategories: (
    activeId: string, 
    overId: string, 
    sourceCategoryId: string,
    targetSectionId: string,
    targetCategoryId: string
  ) => void;
}

export function SortableSectionForm({
  section,
  onUpdate,
  onDelete,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  isExpanded,
  onToggle,
  expandedCategories,
  onToggleCategory,
  onReorderCategories,
  onMoveCategoryBetweenSections,
  onReorderMenuItems,
  onMoveMenuItemBetweenCategories,
}: SortableSectionFormProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: "Section",
      section,
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
      className={`py-4 ${isDragging ? 'opacity-50' : ''}`}
    >
      <CardHeader className="px-4">
        <div className="flex items-center justify-between">
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
            <CardTitle className="flex items-center gap-2">
              {section.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddCategory}
            >
              <Plus className="h-4 w-4 md:mr-1" />
              <span className="hidden md:block">Add Category</span>
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
      </CardHeader>
      
      <Collapsible open={isExpanded}>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
                <Input
                  id={`section-title-${section.id}`}
                  value={section.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="Enter section title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`section-href-${section.id}`}>Section URL</Label>
                <Input
                  id={`section-href-${section.id}`}
                  value={section.href}
                  onChange={(e) => onUpdate({ href: e.target.value })}
                  placeholder="/section-url"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Categories</h4>
              <SortableContext 
                items={section.categories.map(category => category.id)}
                strategy={verticalListSortingStrategy}
              >
                {section.categories.map((category) => (
                  <SortableCategoryForm
                    key={category.id}
                    category={category}
                    sectionId={section.id}
                    onUpdate={(updates) => onUpdateCategory(category.id, updates)}
                    onDelete={() => onDeleteCategory(category.id)}
                    onAddItem={() => onAddMenuItem(category.id)}
                    onUpdateItem={(itemId, updates) => onUpdateMenuItem(category.id, itemId, updates)}
                    onDeleteItem={(itemId) => onDeleteMenuItem(category.id, itemId)}
                    isExpanded={expandedCategories.has(category.id)}
                    onToggle={() => onToggleCategory(category.id)}
                    onReorderItems={(activeId, overId) => onReorderMenuItems(category.id, activeId, overId)}
                    onMoveItemBetweenCategories={(activeId, overId, targetSectionId, targetCategoryId) => 
                      onMoveMenuItemBetweenCategories(activeId, overId, category.id, targetSectionId, targetCategoryId)
                    }
                  />
                ))}
              </SortableContext>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

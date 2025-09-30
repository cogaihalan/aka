"use client";

import { Button } from "@/components/ui/button";
import { Plus, Save, RefreshCw } from "lucide-react";
import { useMegaMenu } from "@/features/mega-menu/hooks/use-mega-menu";
import { SortableSectionForm } from "@/features/mega-menu/components/sortable-section-form";
import PageContainer from "@/components/layout/page-container";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";

export default function MegaMenuPage() {
  const {
    megaMenuData,
    isLoading,
    isSaving,
    expandedSections,
    expandedCategories,
    fetchMegaMenuData,
    saveMegaMenuData,
    addSection,
    updateSection,
    deleteSection,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleSection,
    toggleCategory,
    reorderSections,
    reorderCategories,
    reorderMenuItems,
    moveCategoryBetweenSections,
    moveMenuItemBetweenCategories,
  } = useMegaMenu();

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleSave = async () => {
    if (!megaMenuData) return;
    await saveMegaMenuData(megaMenuData);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !megaMenuData) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle section reordering
    if (activeData?.type === "Section" && overData?.type === "Section") {
      reorderSections(activeId, overId);
      return;
    }

    // Handle category reordering within the same section
    if (activeData?.type === "Category" && overData?.type === "Category" && 
        activeData.sectionId === overData.sectionId) {
      reorderCategories(activeData.sectionId, activeId, overId);
      return;
    }

    // Handle category moving between sections
    if (activeData?.type === "Category" && overData?.type === "Section") {
      moveCategoryBetweenSections(activeId, overId, overId);
      return;
    }

    // Handle menu item reordering within the same category
    if (activeData?.type === "MenuItem" && overData?.type === "MenuItem" && 
        activeData.categoryId === overData.categoryId) {
      reorderMenuItems(activeData.sectionId, activeData.categoryId, activeId, overId);
      return;
    }

    // Handle menu item moving between categories
    if (activeData?.type === "MenuItem" && overData?.type === "Category") {
      moveMenuItemBetweenCategories(
        activeId, 
        overId, 
        activeData.sectionId, 
        activeData.categoryId,
        overData.sectionId,
        overId
      );
      return;
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic if needed
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <RefreshCw className="h-8 w-8 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!megaMenuData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load mega menu data</p>
        <Button onClick={fetchMegaMenuData} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mega Menu Configuration</h1>
            <p className="text-muted-foreground">
              Configure your site's navigation menu structure with drag & drop
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={addSection}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <SortableContext 
            items={megaMenuData.items.map(section => section.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {megaMenuData.items.map((section) => (
                <SortableSectionForm
                  key={section.id}
                  section={section}
                  onUpdate={(updates) => updateSection(section.id, updates)}
                  onDelete={() => deleteSection(section.id)}
                  onAddCategory={() => addCategory(section.id)}
                  onUpdateCategory={(categoryId, updates) => updateCategory(section.id, categoryId, updates)}
                  onDeleteCategory={(categoryId) => deleteCategory(section.id, categoryId)}
                  onAddMenuItem={(categoryId) => addMenuItem(section.id, categoryId)}
                  onUpdateMenuItem={(categoryId, itemId, updates) => updateMenuItem(section.id, categoryId, itemId, updates)}
                  onDeleteMenuItem={(categoryId, itemId) => deleteMenuItem(section.id, categoryId, itemId)}
                  isExpanded={expandedSections.has(section.id)}
                  onToggle={() => toggleSection(section.id)}
                  expandedCategories={expandedCategories}
                  onToggleCategory={toggleCategory}
                  onReorderCategories={(activeId, overId) => reorderCategories(section.id, activeId, overId)}
                  onMoveCategoryBetweenSections={(activeId, overId, targetSectionId) => 
                    moveCategoryBetweenSections(activeId, overId, targetSectionId)
                  }
                  onReorderMenuItems={(categoryId, activeId, overId) => 
                    reorderMenuItems(section.id, categoryId, activeId, overId)
                  }
                  onMoveMenuItemBetweenCategories={(activeId, overId, targetSectionId, targetCategoryId) =>
                    moveMenuItemBetweenCategories(activeId, overId, section.id, activeId, targetSectionId, targetCategoryId)
                  }
                />
              ))}
            </div>
          </SortableContext>
          
          <DragOverlay>
            {activeId ? (
              <div className="opacity-50">
                {/* You can customize the drag overlay here */}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </PageContainer>
  );
}

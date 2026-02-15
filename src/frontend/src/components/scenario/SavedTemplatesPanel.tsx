import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerTemplates, useSaveTemplate, useDeleteTemplate } from '../../hooks/useSavedTemplates';
import { serializeScenario, deserializeScenario } from '../../utils/scenarioPersistence';
import { Save, Trash2, Download, LogIn } from 'lucide-react';
import type { CombatScenario } from '../../models/combat';

interface SavedTemplatesPanelProps {
  currentScenario: CombatScenario;
  onLoadScenario: (scenario: CombatScenario) => void;
}

export function SavedTemplatesPanel({ currentScenario, onLoadScenario }: SavedTemplatesPanelProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const [templateName, setTemplateName] = useState('');
  
  const { data: templates = [], isLoading } = useGetCallerTemplates();
  const { mutate: saveTemplate, isPending: isSaving } = useSaveTemplate();
  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate();
  
  const handleSave = () => {
    if (!templateName.trim()) return;
    
    const serialized = serializeScenario(currentScenario);
    saveTemplate(
      { name: templateName, scenario: serialized },
      {
        onSuccess: () => {
          setTemplateName('');
        }
      }
    );
  };
  
  const handleLoad = (templateId: bigint) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    try {
      const scenario = deserializeScenario(template.scenario);
      onLoadScenario(scenario);
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };
  
  const handleDelete = (templateId: bigint) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(templateId);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Saved Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertDescription>
              Log in to save and load scenario templates
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Saved Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Save Current Scenario */}
        <div className="space-y-2">
          <Input
            placeholder="Template name..."
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && templateName.trim()) {
                handleSave();
              }
            }}
          />
          <Button
            onClick={handleSave}
            disabled={!templateName.trim() || isSaving}
            className="w-full"
            size="sm"
          >
            <Save className="h-3 w-3 mr-2" />
            {isSaving ? 'Saving...' : 'Save Current Scenario'}
          </Button>
        </div>
        
        {/* Templates List */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Your Templates</p>
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              Loading templates...
            </div>
          ) : templates.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No saved templates yet
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 pr-4">
                {templates.map((template) => (
                  <div
                    key={template.id.toString()}
                    className="flex items-center gap-2 p-2 rounded-md border border-border hover:bg-accent/50 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 justify-start"
                      onClick={() => handleLoad(template.id)}
                    >
                      <Download className="h-3 w-3 mr-2" />
                      {template.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

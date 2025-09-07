import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  Brain,
  Upload,
  Download
} from 'lucide-react';

const ContentManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-2">Manage learning content, vocabulary, and quiz materials</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Vocabulary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-gray-600">Vocabulary stages</p>
              </div>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Vocabulary Stage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Quizzes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-gray-600">Quiz stages</p>
              </div>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Quiz Stage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Bulk Import</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">CSV</div>
                <p className="text-sm text-gray-600">Import format</p>
              </div>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Import Content
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Content Library</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content available</h3>
            <p className="text-gray-600 mb-4">
              Start by creating your first vocabulary stage or quiz
            </p>
            <div className="flex justify-center space-x-4">
              <Button>
                <BookOpen className="h-4 w-4 mr-2" />
                Create Vocabulary Stage
              </Button>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Create Quiz Stage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Content Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Basic Vocabulary</h4>
                <Badge variant="secondary">Template</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Simple word-translation pairs for beginners
              </p>
              <Button size="sm" variant="outline">
                Use Template
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Multiple Choice Quiz</h4>
                <Badge variant="secondary">Template</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Standard quiz format with 4 answer options
              </p>
              <Button size="sm" variant="outline">
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;

import { Button, Card, CardContent, CardHeader, CardTitle } from './ui-components';

const TestPage = () => {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Test Button</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage;

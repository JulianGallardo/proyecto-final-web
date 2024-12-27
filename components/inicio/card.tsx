"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomCardProps {
    title: string;
    description: string;
    icon: React.ComponentType;
    onClick: () => void;
    }


export default function CustomCard({ title, description, icon: Icon, onClick }: CustomCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex items-center justify-center">
        <Icon />
      </CardHeader>
      <CardContent className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onClick} className="bg-blue-500 hover:bg-blue-600 text-white">
          Ver {title}
        </Button>
      </CardFooter>
    </Card>
  );
}

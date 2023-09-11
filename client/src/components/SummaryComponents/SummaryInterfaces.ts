import { ReactNode } from 'react';

export interface Quote {
    Person: string;
    Quote: string;
}

export interface Topic {
    Summary: string;
    Quotes: Quote[];
}

export interface SubSection {
    [key: string]: Topic;
}

export interface Level1SummaryProps {
    activeSection?: string | null;
    data: Record<string, any> | null;
}

export interface TopicContainerProps {
    isActive: boolean;
    children?: ReactNode;
}

export interface Level2SummaryProps {
    activeSection?: string | null;
    data: Record<string, any> | null;
}

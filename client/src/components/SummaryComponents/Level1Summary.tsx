import React, { useState, useEffect, memo, FC } from 'react';
import styled from 'styled-components';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import {
    TopicCard,
    TopicTitle,
    TopicSummary,
    QuoteBox,
    QuoteText,
    MainSectionTitle,
    Container,
    ShowQuotesButton,
    HideQuotesButton,
} from './SummaryStyles';

import { Level1SummaryProps, SubSection, TopicContainerProps } from './SummaryInterfaces';


const StyledTopicContainer = styled.div.attrs<TopicContainerProps>(props => ({
    isActive: props.isActive
})) <TopicContainerProps>`
    display: ${props => (props.isActive ? "block" : "none")};
    margin-bottom: 20px;
`;

const TopicContainer: React.FC<TopicContainerProps> = ({ isActive, children }) => {
    return <StyledTopicContainer isActive={isActive}>{children}</StyledTopicContainer>;
};


const Level1Summary: React.FC<Level1SummaryProps> = ({ activeSection, data }) => {
    const [activeQuote, setActiveQuote] = useState<Record<string, boolean>>({});

    const toggleQuote = (mainSection: string, subSection: string, topic: string) => {
        const key = `${mainSection}-${subSection}-${topic}`;
        setActiveQuote((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const renderTopics = (mainSection: string, subSection: string, topics: SubSection) => {
        return Object.keys(topics).map((topicKey, idx) => {
            const topic = topics[topicKey];
            return (
                <TopicCard key={`${topicKey}-${idx}`}>
                    <TopicTitle>{topicKey}</TopicTitle>
                    <TopicSummary>{topic.Summary}</TopicSummary>
                    <QuoteBox>
                        {activeQuote[`${mainSection}-${subSection}-${topicKey}`] ? (
                            <div>
                                {topic.Quotes.map((quote, idx) => (
                                    <QuoteText key={`${quote}-${idx}`}>
                                        <strong>{quote.Person}:</strong> {quote.Quote}
                                    </QuoteText>
                                ))}
                                <HideQuotesButton onClick={() => toggleQuote(mainSection, subSection, topicKey)}>
                                    <ExpandLessIcon style={{ marginRight: '10px' }} /> Hide Quotes
                                </HideQuotesButton>
                            </div>
                        ) : (
                            <ShowQuotesButton onClick={() => toggleQuote(mainSection, subSection, topicKey)}>
                                <FormatQuoteIcon style={{ marginRight: '5px' }} /> Show Quotes
                            </ShowQuotesButton>
                        )}
                    </QuoteBox>
                </TopicCard>
            );
        });
    };

    return (
        <Container>
            {data && Object.keys(data).map((mainSection, idx) => (
                <div key={`${mainSection}-${idx}`}>
                    <MainSectionTitle>Detailed Summary</MainSectionTitle>
                    {Object.keys(data[mainSection]).map((subSection, idx) => (
                        <TopicContainer
                            key={`${subSection}-${idx}`}
                            isActive={activeSection === subSection}
                        >
                            {Array.isArray(data[mainSection][subSection]) &&
                                data[mainSection][subSection].map((topicData, idx) => (
                                    <div key={`${topicData}-${idx}`}>
                                        {renderTopics(mainSection, subSection, topicData)}
                                    </div>
                                ))}
                        </TopicContainer>
                    ))}
                </div>
            ))}
        </Container>
    );
};

export default Level1Summary;
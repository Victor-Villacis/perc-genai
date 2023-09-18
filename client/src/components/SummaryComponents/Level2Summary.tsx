import React, { useState, useEffect, memo, FC } from 'react';
import styled from 'styled-components';

import {
	TopicCard,
	TopicTitle,
	TopicSummary,
	QuoteBox,
	QuoteText,
	MainSectionTitle,
	Container,

} from './SummaryStyles';

import { Level2SummaryProps, Quote } from './SummaryInterfaces';



const Level2Summary: React.FC<Level2SummaryProps> = memo(({ data }) => {

	const renderLevel2Summary = () => {
		const level2Data = data ? data["Level2Summary"] : null;
		if (!level2Data) {
			return <p>No Level 2 Summary Data Available</p>;
		}
		return (
			<>
				{Object.keys(level2Data).map((sectionKey) => {
					const section = level2Data[sectionKey];
					return (
						<TopicCard key={`${sectionKey}-${Math.random()}`}>
							<TopicTitle>{sectionKey}</TopicTitle>
							<TopicSummary>{section.Summary}</TopicSummary>
							<QuoteBox>
								{section.Quotes.map((quote: Quote, idx: number) => (
									<QuoteText key={`${idx}-${Math.random()}`}>
										{quote.Person}: {quote.Quote}
									</QuoteText>
								))}
							</QuoteBox>
						</TopicCard>
					);
				})}
			</>
		);
	};


	return (
		<Container>
			<MainSectionTitle>Overall Summary</MainSectionTitle>
			{renderLevel2Summary()}
		</Container>
	);
});

export default Level2Summary;


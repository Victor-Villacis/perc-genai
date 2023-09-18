// import React, { useState } from 'react';
// import styled from 'styled-components';

// import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// // Interface
// interface Quote {
//     Person: string;
//     Quote: string;
// }

// interface Topic {
//     Summary: string;
//     Quotes: Quote[];
// }

// interface SubSection {
//     [key: string]: Topic;
// }

// interface MainSection {
//     [key: string]: SubSection[];
// }

// interface Section {
//     [key: string]: {
//         [key: string]: Topic;
//     }[];
// }

// interface ContentBoxProps {
//     activeSection?: string;
//     data: Section;
// }

// interface TopicContainerProps {
//     active: boolean;
// }

// // Styled Components
// const Container = styled.div`
//   margin-top: 20px;
//   width: 80%;
//   margin: auto;
//   margin-bottom: 20px;
//   padding: 20px;
// `;

// const QuoteBox = styled.div`
//   background-color: #8a95a5;
//   padding: 5px;
//   color: #000;
// `;

// const HideQuotesButton = styled.div`
//   background-color: #aaa;
//   padding: 10px;
//   cursor: pointer;
//   display: flex;
//   color: black;
// `;

// const ShowQuotesButton = styled.div`
//   background-color: #ccc;
//   padding: 10px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   color: black;
// `;

// const MainSectionHeader = styled.h2`
// `;

// const SubSectionHeader = styled.h3`
// `;

// const TopicHeader = styled.h3`
// `;

// const TopicSummary = styled.p`
// `;

// const QuoteText = styled.p`
// `;

// const Level2SummaryText = styled.p`
// `;

// const TopicBox = styled.div``;


// const TopicContainer = styled.div<TopicContainerProps>`
//   display: ${(props) => (props.active ? 'block' : 'none')};
// `;


// const ContentBox: React.FC<ContentBoxProps> = ({ activeSection, data }) => {
//     const [activeQuote, setActiveQuote] = useState<Record<string, boolean>>({});

//     const toggleQuote = (mainSection: string, subSection: string, topic: string) => {
//         const key = `${mainSection}-${subSection}-${topic}`;
//         setActiveQuote((prevState) => ({
//             ...prevState,
//             [key]: !prevState[key],
//         }));
//     };

//     const renderTopics = (mainSection: string, subSection: string, topics: SubSection) => {
//         return Object.keys(topics).map((topicKey) => {
//             const topic = topics[topicKey];
//             return (
//                 <div key={topicKey}>
//                     <TopicHeader>{topicKey}</TopicHeader>
//                     <TopicSummary>{topic.Summary}</TopicSummary>
//                     <QuoteBox>
//                         {activeQuote[`${mainSection}-${subSection}-${topicKey}`] ? (
//                             <div>
//                                 {topic.Quotes.map((quote, idx) => (
//                                     <QuoteText key={idx}>
//                                         {quote.Person}: {quote.Quote}
//                                     </QuoteText>
//                                 ))}
//                                 <HideQuotesButton onClick={() => toggleQuote(mainSection, subSection, topicKey)}>
//                                     <ExpandLessIcon style={{ marginRight: '10px' }} />
//                                 </HideQuotesButton>
//                             </div>
//                         ) : (
//                             <ShowQuotesButton onClick={() => toggleQuote(mainSection, subSection, topicKey)}>
//                                 <FormatQuoteIcon style={{ marginRight: '5px' }} />
//                                 Quotes
//                             </ShowQuotesButton>
//                         )}
//                     </QuoteBox>
//                 </div>
//             );
//         });
//     };


//     const renderLevel2Summary = () => {
//         const level2Data = data["Level2Summary"];
//         if (!level2Data) {
//             return <p>No Level 2 Summary Data Available</p>;
//         }
//     return (
//         <>
//             {Object.keys(level2Data).map((sectionKey, idx) => {
//                 const section = level2Data[sectionKey];
//                 return (
//                     <div key={`${sectionKey}-${idx}`}>
//                         <h3>{sectionKey}</h3>
//                         <p>{section.Summary}</p>
//                         {section.Quotes.map((quote, idx) => (
//                             <p key={idx}>
//                                 {quote.Person}: {quote.Quote}
//                             </p>
//                         ))}
//                     </div>
//                 );
//             })}
//         </>
//     );
// };

//     return (
//         <Container>
//             {activeSection === "Level2Summary" ? renderLevel2Summary() : (
//                 data && Object.keys(data).map((mainSection) => (
//                     <div key={mainSection}>
//                         <MainSectionHeader>{mainSection}</MainSectionHeader>
//                         {Object.keys(data[mainSection]).map((subSection) => (
//                             <TopicContainer key={subSection} active={activeSection === subSection}>
//                                 <SubSectionHeader>{subSection}</SubSectionHeader>
//                                 {Array.isArray(data[mainSection][subSection]) &&
//                                     data[mainSection][subSection].map((topicData: any, idx: number) => (
//                                         <TopicBox key={idx}>
//                                             {renderTopics(mainSection, subSection, topicData)}
//                                         </TopicBox>
//                                     ))}
//                             </TopicContainer>
//                         ))}
//                     </div>
//                 ))
//             )}
//         </Container>
//     );
// };

// export default ContentBox;

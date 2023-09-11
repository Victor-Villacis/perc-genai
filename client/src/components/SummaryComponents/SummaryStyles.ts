import styled from 'styled-components';


export const MainSectionTitle = styled.h2`
  font-size: 2.5rem; 
  font-weight: 700;   
  letter-spacing: 1.2px;
  color: #004387;   
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
  padding-bottom: 10px;
  text-align:center;
`;

export const TopicTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  margin-top: 0;
  color: #004387;
`;


export const TopicSummary = styled.p`
  margin-bottom: 20px;
  font-size: 1em;
  line-height: 1.6;
  color: #333;
`;

export const QuoteText = styled.p`
	font-style: italic;
  margin-bottom: 5px;
  margin: 0;
  padding: 0;
  font-size: 0.9em;
`;

export const QuoteBox = styled.div`
  background: #f4f5f7;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
`;

export const TopicCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 20px;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const HideQuotesButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
`;

export const ShowQuotesButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
`;

export const Container = styled.div`
  margin-top: 20px;
  width: 80%;
  margin: auto;
  margin-bottom: 20px;
  padding: 20px;
`;







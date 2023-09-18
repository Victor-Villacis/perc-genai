import React, { memo, FC } from 'react';

import { Button } from '@mui/material';
import styled from 'styled-components';

interface NavBoxProps {
  activeSection: string | null;
  setActiveSection: React.Dispatch<React.SetStateAction<string | null>>;
  sections: string[];
  toggleSummaryType: () => void;
  isDataAvailable: boolean;
  summaryType: 'detailed' | 'overall';
}

const NavBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f3f4f6;  
  border-radius: 8px;
  width: 80%;
  margin: auto;
  margin-bottom: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Section = styled.div<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: ${(props) => (props.isActive ? '600' : '400')};
  color: ${(props) => (props.isActive ? '#004387' : '#333')};
  background-color: ${(props) => (props.isActive ? '#cce4f6' : 'transparent')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (!props.isActive ? '#e6f0f3' : '#cce4f6')};
  }
`;

const ToggleButton = styled(Button)`
  && {
    background-color: #004387; 
    color: #fff;
    padding: 10px 30px;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.2s ease-in-out;
    height: 40px;  
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis;  
  }

  &&:hover {
    background-color: #003366;
  }

  &&:disabled {
    background-color: #ccc;
    color: transparent;
  }

  @media (max-width: 768px) {
    && {
      font-size: 0.8rem;
      font-size: calc(1rem + 0.5vw);
      padding: 20px;
      white-space: wrap; 
      line-height: 18px;
      
    }
  }

  @media (max-width: 576px) {
    && {
      font-size: 0.6rem;
      font-size: calc(1rem + 0.5vw);
      padding: 20px;
    }
  }
`;


const NavBox: FC<NavBoxProps> = memo(({ activeSection, setActiveSection, sections, toggleSummaryType, isDataAvailable, summaryType }) => {
  const buttonText = summaryType === 'detailed' ? "Overall Summary" : "Detailed Summary";


  const handleToggleSummaryType = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();  // Stop event from bubbling up
    toggleSummaryType();
  };



  return (
    <NavBoxContainer>
      <SectionContainer>
        {activeSection !== "Level2Summary" && (
          <section style={{ display: 'flex', alignItems: 'center', flexWrap: "wrap" }}>
            {sections.map((section, idx) => (
              <Section key={`${section}-${idx}`} isActive={activeSection === section} onClick={() => setActiveSection(section)}>
                {section}
              </Section>
            ))}
          </section>
        )}
      </SectionContainer>
      <ToggleButton
        type="button"
        variant="contained"
        onClick={handleToggleSummaryType}
        disabled={!isDataAvailable}
      >
        {buttonText}
      </ToggleButton>
    </NavBoxContainer>
  );
});

export default NavBox;

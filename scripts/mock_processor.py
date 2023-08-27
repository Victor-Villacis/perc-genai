import time
import os

detailedSummary = """
Introductions1
     Introductions1
          Summary: The participants introduced themselves and shared who they would like to have lunch with. Gabe Haggard mentioned Jesus, Alex F chose her grandmother, Jed Finley picked Kermit the Frog, Clarence Williamson opted for President Barack Obama, and Allison D mentioned Paul Kalanithi from the book 'When Breath Becomes Air'.
          Quote 1 - Gabe H: I would think the one person would probably be Jesus. I think that would be a pretty cool lunchtime conversation.
          Quote 2 - Alex F: My grandmother. I just miss her so much, and it�s been more than 30 years since she�s been gone. And I would just love to talk to her.
     Discussion Guidelines1
          Summary: The facilitator provided guidelines for the discussion, emphasizing that there are no wrong answers and encouraging participants to speak one at a time. They also mentioned the confidentiality of the conversation and the importance of avoiding specific product or medication discussions.
          Quote 1 - Wes P: Our discussion today is led by Janssen CorEvitas. Just so you�re all aware, HealthiVibe is now CorEvitas. We had a rebranding. But it�s the same people. Nothing else has changed, just the name.
          Quote 2 - Wes P: Our conversation today is confidential. I always tell my groups this is a positive thing. This is a closed circle. You can feel comfortable sharing your thoughts, opinions, ideas, knowing that it stays within this circle.
     Book/TV Character or Real-Life Person for Lunch1
          Summary: Participants shared their choices for a book, TV character, or real-life person they would like to have lunch with. Aarti P mentioned Ben Franklin, Bridget D chose Alexander Hamilton, Gabrielle G picked Leonardo DaVinci, and Casey C opted for Nichelle Nichols.
          Quote 1 - Aarti P: I was thinking, actually, that- I was reading this book about Ben Franklin. So I�d really love to have a conversation with him. He�s so just innovative, and just some of the things that he�s- never would have thought until I started reading this book.
          Quote 2 - Casey C: If you don�t know her, she was the original Uhura on Star Trek. And she was also just a groundbreaking advocate for women and people of color, not only in acting, but in STEM.

NMS Awareness1
     Experience with Non-Medical Switching1
          Summary: Participants shared their personal experiences with non-medical switching, where patients are switched to a different medication for reasons other than the original medicine not working or side effects. Alex shared her recent experience where her insurance company refused to cover her prescribed medication, leading to a three-month gap in treatment. Clarence also experienced a formulary change that resulted in a significant increase in the cost of his medication. Both participants expressed frustration and concern about the impact of non-medical switching on their health.
          Quote 1 - Alex F: I was scared because the medications for PH are life-sustaining. And so, I really did get scared and upset.
          Quote 2 - Clarence W: The formulary change was the cause of this medication needing to be switched because of the cost.
     Insurance Company Decision-Making1
          Summary: Participants discussed their perception that non-medical switching decisions are primarily driven by insurance companies for cost-saving purposes. They expressed frustration with the lack of medical justification and the perception that decisions are made by business-minded individuals rather than medical professionals. Jed shared his belief that insurance companies prioritize financial considerations over patient well-being, while Gabe mentioned that insurance decisions are often influenced by copay amounts and cost-effectiveness.
          Quote 1 - Jed F: I really feel like it's always business. They may tell someone on the medical side that, 'Hey, we really think you should approve this.' But I'd like to think in my - that someone with medical training and medical degree would sit back and go, 'No, I don't think so. Let's just stay at the chorus.'
          Quote 2 - Gabe H: In my experience, in my perception, it has been due to, perhaps, the variety of copay that I might be responsible for, in the situations I've been involved with.
     Impact on Patient Health and Well-being1
          Summary: Participants expressed concerns about the impact of non-medical switching on patient health and well-being. They highlighted the importance of personalized treatment plans and the frustration of being forced to switch medications that may not be as effective or suitable for their specific condition. Allison, as a nurse, emphasized the frustration of healthcare providers when insurance companies dictate treatment decisions that may not align with the best course of action for the patient's health.
          Quote 1 - Allison D: It's really frustrating, especially with pulmonary hypertension. It's such a serious disease. And if insurance companies want to dictate how you treat someone with severe pulmonary hypertension, that would not work, in comparison to someone with very mild pulmonary hypertension.
          Quote 2 - Clarence W: And the only thing that could be done is if the insurance company made a special compensation for me personally. And I'm not wanting to - if I need to pay for what I need and I've got the resources, I go ahead and do it.
     Challenges in Challenging Non-Medical Switching1
          Summary: Participants discussed the challenges they faced in challenging non-medical switching decisions. Alex shared her experience of reaching out to her doctor's office and the insurance company, but not receiving much support or options to challenge the decision. Clarence mentioned that his doctor didn't seem willing to challenge the decision and that the only option would be for the insurance company to make a special compensation. Both participants expressed frustration with the lack of options and the feeling of being powerless in the face of insurance decisions.
          Quote 1 - Alex F: The doctor's office told me that if I wanted to fight with them, that would be fine. But that we just needed to wait those many weeks to get the right heart cath and anything else taken care of. And they said that it would be better if I just left it alone.
          Quote 2 - Clarence W: The doctor didn't seem willing to challenge it. She's just, it is what it is basically. And the only thing that could be done is if the insurance company made a special compensation for me personally.
"""

overallSummary = """
Introductions2
     Introductions2
          Summary: The participants introduced themselves and shared who they would like to have lunch with. Gabe Haggard mentioned Jesus, Alex F chose her grandmother, Jed Finley picked Kermit the Frog, Clarence Williamson opted for President Barack Obama, and Allison D mentioned Paul Kalanithi from the book 'When Breath Becomes Air'.
          Quote 1 - Gabe H: I would think the one person would probably be Jesus. I think that would be a pretty cool lunchtime conversation.
          Quote 2 - Alex F: My grandmother. I just miss her so much, and it�s been more than 30 years since she�s been gone. And I would just love to talk to her.
     Discussion Guidelines2
          Summary: The facilitator provided guidelines for the discussion, emphasizing that there are no wrong answers and encouraging participants to speak one at a time. They also mentioned the confidentiality of the conversation and the importance of avoiding specific product or medication discussions.
          Quote 1 - Wes P: Our discussion today is led by Janssen CorEvitas. Just so you�re all aware, HealthiVibe is now CorEvitas. We had a rebranding. But it�s the same people. Nothing else has changed, just the name.
          Quote 2 - Wes P: Our conversation today is confidential. I always tell my groups this is a positive thing. This is a closed circle. You can feel comfortable sharing your thoughts, opinions, ideas, knowing that it stays within this circle.
     Book/TV Character or Real-Life Person for Lunch2
          Summary: Participants shared their choices for a book, TV character, or real-life person they would like to have lunch with. Aarti P mentioned Ben Franklin, Bridget D chose Alexander Hamilton, Gabrielle G picked Leonardo DaVinci, and Casey C opted for Nichelle Nichols.
          Quote 1 - Aarti P: I was thinking, actually, that- I was reading this book about Ben Franklin. So I�d really love to have a conversation with him. He�s so just innovative, and just some of the things that he�s- never would have thought until I started reading this book.
          Quote 2 - Casey C: If you don�t know her, she was the original Uhura on Star Trek. And she was also just a groundbreaking advocate for women and people of color, not only in acting, but in STEM.

NMS Awareness2
     Experience with Non-Medical Switching2
          Summary: Participants shared their personal experiences with non-medical switching, where patients are switched to a different medication for reasons other than the original medicine not working or side effects. Alex shared her recent experience where her insurance company refused to cover her prescribed medication, leading to a three-month gap in treatment. Clarence also experienced a formulary change that resulted in a significant increase in the cost of his medication. Both participants expressed frustration and concern about the impact of non-medical switching on their health.
          Quote 1 - Alex F: I was scared because the medications for PH are life-sustaining. And so, I really did get scared and upset.
          Quote 2 - Clarence W: The formulary change was the cause of this medication needing to be switched because of the cost.
     Insurance Company Decision-Making2
          Summary: Participants discussed their perception that non-medical switching decisions are primarily driven by insurance companies for cost-saving purposes. They expressed frustration with the lack of medical justification and the perception that decisions are made by business-minded individuals rather than medical professionals. Jed shared his belief that insurance companies prioritize financial considerations over patient well-being, while Gabe mentioned that insurance decisions are often influenced by copay amounts and cost-effectiveness.
          Quote 1 - Jed F: I really feel like it's always business. They may tell someone on the medical side that, 'Hey, we really think you should approve this.' But I'd like to think in my - that someone with medical training and medical degree would sit back and go, 'No, I don't think so. Let's just stay at the chorus.'
          Quote 2 - Gabe H: In my experience, in my perception, it has been due to, perhaps, the variety of copay that I might be responsible for, in the situations I've been involved with.
     Impact on Patient Health and Well-being2
          Summary: Participants expressed concerns about the impact of non-medical switching on patient health and well-being. They highlighted the importance of personalized treatment plans and the frustration of being forced to switch medications that may not be as effective or suitable for their specific condition. Allison, as a nurse, emphasized the frustration of healthcare providers when insurance companies dictate treatment decisions that may not align with the best course of action for the patient's health.
          Quote 1 - Allison D: It's really frustrating, especially with pulmonary hypertension. It's such a serious disease. And if insurance companies want to dictate how you treat someone with severe pulmonary hypertension, that would not work, in comparison to someone with very mild pulmonary hypertension.
          Quote 2 - Clarence W: And the only thing that could be done is if the insurance company made a special compensation for me personally. And I'm not wanting to - if I need to pay for what I need and I've got the resources, I go ahead and do it.
     Challenges in Challenging Non-Medical Switching2
          Summary: Participants discussed the challenges they faced in challenging non-medical switching decisions. Alex shared her experience of reaching out to her doctor's office and the insurance company, but not receiving much support or options to challenge the decision. Clarence mentioned that his doctor didn't seem willing to challenge the decision and that the only option would be for the insurance company to make a special compensation. Both participants expressed frustration with the lack of options and the feeling of being powerless in the face of insurance decisions.
          Quote 1 - Alex F: The doctor's office told me that if I wanted to fight with them, that would be fine. But that we just needed to wait those many weeks to get the right heart cath and anything else taken care of. And they said that it would be better if I just left it alone.
          Quote 2 - Clarence W: The doctor didn't seem willing to challenge it. She's just, it is what it is basically. And the only thing that could be done is if the insurance company made a special compensation for me personally.
"""


if __name__ == "__main__":
    print("Processing data...")
    time.sleep(5)  # Simulate a processing delay

    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.realpath(__file__))

    # Construct the relative path to the output folder
    output_folder = os.path.join(
        script_dir, "..", "server/src/services", "output_folder"
    )

    print("Output folder:", output_folder)

    # Make sure the output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    detailed_output_path = os.path.join(output_folder, "detailed-summary.txt")
    with open(detailed_output_path, "w", encoding="utf-8") as file:
        file.write(detailedSummary)

    overall_output_path = os.path.join(output_folder, "overall-summary.txt")
    with open(overall_output_path, "w", encoding="utf-8") as file:
        file.write(overallSummary)

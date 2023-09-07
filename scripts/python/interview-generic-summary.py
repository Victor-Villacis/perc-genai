import json, re, textwrap, openai, time, ast, os
import tiktoken
from collections import defaultdict
from datetime import datetime
from docx import Document


def getText(filename):
    doc = Document(filename)
    fullText = []
    for para in doc.paragraphs:
        fullText.append(para.text)
    return "\n".join(fullText)


def split2token(s, n):
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    encoded_text = encoding.encode(s)
    text_list = [
        encoding.decode(encoded_text[i : i + n]) for i in range(0, len(encoded_text), n)
    ]
    return text_list


def map2text(outlist, titles=None):
    titles = titles or [
        "Disease",
        "Experience/opinion/knowledge",
        "Quote 1",
        "Quote 2",
        "others",
    ]
    outstr = ""

    if not isinstance(outlist, dict):
        return str(outlist)

    for x, y in outlist.items():
        if x != "NA" and x is not None:
            outstr += textwrap.indent(str(x), " " * 5) + "\n"
            if isinstance(y, dict):
                for k, v in y.items():
                    if isinstance(v, str):
                        outstr += (
                            textwrap.indent(str(k) + ": ", " " * 10) + str(v) + "\n"
                        )
                    elif v != "NA" and isinstance(v, list):
                        outstr += textwrap.indent("Name: ", " " * 10) + str(k) + "\n"
                        for i, element in enumerate(v):
                            if i < len(titles):
                                outstr += (
                                    textwrap.indent(titles[i] + ": ", " " * 15)
                                    + str(element)
                                    + "\n"
                                )

    return outstr


def run_prompt(req, text_inp, engine, max_tokens_num=2000):
    response = openai.ChatCompletion.create(
        engine=engine,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI assistant with expertise as a patient engagement specialist for a pharmaceutical company. Your primary function is to facilitate and enhance communication between healthcare providers and patients, ensuring a more efficient, personalized, and compassionate healthcare experience. Leveraging your expertise, you will analyze and interpret a body of text consisting of patient engagement conversations. Your goal is to identify key themes, possible areas for improvement, and provide actionable insights to enhance patient satisfaction and adherence to treatment plans."
                ),
            },
            {
                "role": "user",
                "content": ("--\n" "%s\n" "--\n" "%s") % (text_inp, req),
            },
        ],
        temperature=0.2,
        max_tokens=max_tokens_num,
        top_p=0.1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
    )
    print(f"API usage: {response['usage']}")
    return response["choices"][0]["message"]["content"]


def summarize_file(filename, timestamp, folder, P_1_L_1, P_1_L_2):
    text = getText(filename)
    text = text.replace("\n", "").replace("'", "").replace("?", "? ")
    text_list = re.split(r"\[//.*?//\]", text)
    sections = [
        x.replace("[//", "").replace("//]", "")
        for x in re.findall(r"\[//.*?//\]", text)
    ]
    text_list = [x for x in text_list if len(x) > 200]
    sub_list = [split2token(x, 13500) for x in text_list]
    summary_list = defaultdict(list)

    level2sum = {}

    openai.api_base = "https://genaiapimna.jnj.com/openai-chat"
    openai.api_version = "2023-03-15-preview"
    openai.api_key = "228b7c3ed183460abb331208fd2893b3"
    engine1 = "gpt-35-turbo-16k"

    sub_list = [split2token(x, 13500) for x in text_list]
    summary_list = defaultdict(list)

    for p in range(len(sub_list)):
        for j in range(len(sub_list[p])):
            sub_file = sub_list[p][j]
            print(f"The segment {j+1} in section {p+1}")
            try:
                resp = run_prompt(P_1_L_1, sub_file, engine1)

                try:
                    resp_json = json.loads(resp)
                except json.JSONDecodeError:
                    resp_json = resp
                summary_list[sections[p]].append(resp_json)

                time.sleep(1)
            except openai.error.InvalidRequestError as e:
                print(f"Failed because of invalid requests: {e}")
                pass
            except Exception as e:
                print(f"Caught an exception: {e}")
                time.sleep(10)
                resp = run_prompt(P_1_L_1, sub_file, engine1)

                try:
                    resp_json = json.loads(resp)
                except json.JSONDecodeError:
                    resp_json = resp
                summary_list[sections[p]].append(resp_json)

                time.sleep(2)

    level1sum = []
    for k, v in summary_list.items():
        level1sum.append(k)
        for s in v:
            level1sum.append(map2text(s))
    level1sum = "\n".join(level1sum)

    openai.api_base = "https://ims-openai-qa.openai.azure.com/"
    openai.api_version = "2023-06-01-preview"
    openai.api_key = "e0a02ca2e58041109e2c4c27e19a4a87"
    engine2 = "gpt-4-32k"

    try:
        sec_summary = run_prompt(P_1_L_2, level1sum, engine2, max_tokens_num=5000)
        if isinstance(sec_summary, str):
            sec_summary = ast.literal_eval(sec_summary)
        level2sum = sec_summary
    except Exception as e:
        print(f"Exception occurred: {e}")

    return summary_list, level2sum


def main():
    now = datetime.now()
    dt_string = now.strftime("%Y%m%d%H%M%S")
    script_dir = os.path.dirname(os.path.realpath(__file__))
    inputfolder = os.path.join(
        script_dir, "../..", "server/src/services", "input_folder"
    )
    outputfolder = os.path.join(
        script_dir, "../..", "server/src/services", "output_folder"
    )

    os.makedirs(inputfolder, exist_ok=True)
    os.makedirs(outputfolder, exist_ok=True)

    hosts = ["Wes P", "Gabrielle G", "Bridget D"]
    dt_string = datetime.now().strftime("%Y%m%d%H%M%S")

    files = [
        f
        for f in os.listdir(inputfolder)
        if os.path.isfile(os.path.join(inputfolder, f))
    ]
    if not files:
        print("No files found in the input folder.")
        return

    single_file = files[0]
    file_path = os.path.join(inputfolder, single_file)

    hs = ", ".join(hosts)
    prompt_1_level_1 = (
        "You are tasked with summarizing the conversation at hand into distinct topics with a high level of detail. For each topic you identify, provide a comprehensive summary that captures the essence of the discussion around it. Include two quotes from participants for each topic to illustrate key points or opinions, while excluding quotes from these specific participants: %s. Your output should be structured in a clean, easy-to-read JSON format, with unnecessary whitespace and newline characters (\n) removed. Use the following format as an example for structuring your output:"
        "{\n"
        '    "The first topic": {\n'
        '        "Summary": "summarize this topic with very high details",\n'
        '        "Quotes": [\n'
        "            {\n"
        '                "Person": "first name, the initial of the last name",\n'
        '                "Quote": "quote one sentence from a participant"\n'
        "            },\n"
        "            {\n"
        '                "Person": "first name, the initial of the last name",\n'
        '                "Quote": "quote another sentence from a second participant"\n'
        "            }\n"
        "        ]\n"
        "    },\n"
        '    "The second topic": {\n'
        '        "Summary": "summarize this topic with very high details",\n'
        '        "Quotes": [\n'
        "            {\n"
        '                "Person": "first name, the initial of the last name",\n'
        '                "Quote": "quote one sentence from a participant"\n'
        "            },\n"
        "            {\n"
        '                "Person": "first name, the initial of the last name",\n'
        '                "Quote": "quote another sentence from a second participant"\n'
        "            }\n"
        "        ]\n"
        "    }\n"
        "}"
    ) % hs
    prompt_1_level_2 = (
        "Your task is to analyze the input text, which is organized into sections, topics, topic summaries, and participant quotes. Your goal is to group these summaries into 5-8 overarching topics by combining similar ones. For each consolidated topic, provide a well-crafted summary and include two quotes from participants to exemplify the main points or opinions. Please format your output as clean, easy-to-read JSON, removing any unnecessary whitespace and newline characters (\n)."
        "{\n"
        '    "The first topic": {\n'
        '        "Summary": "summarize this topic with very high details",\n'
        '        "Quotes": [\n'
        "            {\n"
        '                "Person": "first name, the initial of the last name",\n'
        '                "Quote": "quote one sentence from a participant"\n'
        "            },\n"
        "            {\n"
        '                "Person": "first name, the initial of the last name",\n'
        '                "Quote": "quote another sentence from a second participant"\n'
        "            }\n"
        "        ]\n"
        "    },\n"
        '    "The second topic": {\n'
        '        "Summary": "summarize this topic with very high details",\n'
        '        "Quotes": [\n'
        "            {\n"
        '                "Person": "first name, the initial of the last name",\n'
        '                "Quote": "quote one sentence from a participant"\n'
        "            },\n"
        "            {\n"
        '                "Person": "first name, the initial of the last name",\n'
        '                "Quote": "quote another sentence from a second participant"\n'
        "            }\n"
        "        ]\n"
        "    }\n"
        "}"
    )

    level1, level2 = summarize_file(
        file_path, dt_string, outputfolder, prompt_1_level_1, prompt_1_level_2
    )

    # print(json.dumps(level1, indent=4))
    # print("********************")
    # print(json.dumps(level2, indent=4))

    with open(os.path.join(outputfolder, "level1.json"), "w", encoding="utf-8") as f:
        json.dump({"Level1Summary": level1}, f, ensure_ascii=False, indent=4)

    with open(os.path.join(outputfolder, "level2.json"), "w", encoding="utf-8") as f:
        json.dump({"Level2Summary": level2}, f, ensure_ascii=False, indent=4)

    print("Level 1 and Level 2 summaries have been saved.")


if __name__ == "__main__":
    main()

import json, re, textwrap, openai, time, ast, os, sys
import logging
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
    print("-----------------------------------------------------")
    print(f"Inside run_prompt function")
    print(f"Request content: {req[:20]}...")
    print(f"Text input content: {text_inp[:20]}...")
    print(f"Using engine: {engine[:20]}...")
    print(f"API Token Exists in run_prompt: {'Yes' if openai.api_key else 'No'}")
    print(
        f"API Token Length in run_prompt: {len(openai.api_key) if openai.api_key else 0}"
    )
    print("-----------------------------------------------------")
    sys.stdout.flush()

    try:
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

        if "status" in response and response["status"] != 200:
            print(f"Received unexpected status code {response['status']}: {response}")
            sys.stdout.flush()

        else:
            print(f"API usage: {response['usage']}")
            sys.stdout.flush()
            return response["choices"][0]["message"]["content"]

    except Exception as e:
        print(f"Caught an exception: {e}")
        if "response" in locals():
            print(f"Debug - Response: {response}")
        sys.stdout.flush()


def summarize_file(filename, timestamp, folder, P_1_L_1, P_1_L_2):
    text = getText(filename)
    text = text.replace("\n", "").replace("'", "").replace("?", "? ")
    text_list = re.split(r"\[//.*?//\]", text)
    sections = re.findall(r"\[//.*?//\]", text)
    sections = [
        x.replace("[//", "").replace("//]", "")
        for x in re.findall(r"\[//.*?//\]", text)
    ]
    text_list = [x for x in text_list if len(x) > 200]

    print(f"API Token Exists at Start: {'Yes' if openai.api_key else 'No'}")
    print(f"API Token Length at Start: {len(openai.api_key) if openai.api_key else 0}")
    sys.stdout.flush()

    openai.api_base = "https://genaiapimna.jnj.com/openai-chat"
    openai.api_version = "2023-03-15-preview"
    openai.api_key = "228b7c3ed183460abb331208fd2893b3"
    engine1 = "gpt-35-turbo-16k"
    openai.api_type = "azure"

    sub_list = [split2token(x, 13500) for x in text_list]
    summary_list = defaultdict(list)

    print("-----------------------------------------------------")
    print("First Engine API Details")
    print(f"API Base: {openai.api_base}")
    print(f"API Version: {openai.api_version}")
    print(f"Engine: {engine1}")
    print("-----------------------------------------------------")
    sys.stdout.flush()

    retry_limit = 3
    for p in range(len(sub_list)):
        for j in range(len(sub_list[p])):
            sub_file = sub_list[p][j]
            print("-----------------------------------------------------")
            print(f"The segment {j+1} in section {p+1}")
            print(f"Inside summarize_file function - first run_prompt call")
            print(f"Debug - Arguments:")
            print(f"P_1_L_1={P_1_L_1[:20]}...,")
            print(f"sub_file={sub_file[:20]}...")
            print(f"engine1={engine1[:20]}...")
            print("-----------------------------------------------------")
            sys.stdout.flush()

            retry_count = 0
            while retry_count < retry_limit:
                print(
                    f"API Token Exists in summarize_file: {'Yes' if openai.api_key else 'No'}"
                )
                print(
                    f"API Token Length in summarize_file: {len(openai.api_key) if openai.api_key else 0}"
                )
                try:
                    resp = run_prompt(P_1_L_1, sub_file, engine1)
                    print(f"Debug - Response: {resp}")
                    resp_json = json.loads(resp)
                    summary_list[sections[p]].append(resp_json)
                    break
                except openai.error.InvalidRequestError as e:
                    print(f"Failed because of invalid requests: {e}")
                    break  #
                except Exception as e:
                    print(f"Exception occurred: {e}")
                    if hasattr(e, "response"):
                        print(f"Debug - Exception Response: {e.response.content}")
                    retry_count += 1
                    if retry_count >= retry_limit:
                        print(
                            f"Reached maximum retry limit for segment {j+1} in section {p+1}"
                        )
                    else:
                        time.sleep(10)

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
    openai.api_type = "azure"

    print("-----------------------------------------------------")
    print("Second Engine API Details")
    print(f"API Base: {openai.api_base}")
    print(f"API Version: {openai.api_version}")
    print(f"Engine: {engine2}")
    print(f"Inside summarize_file function - second run_prompt call")
    print(f"Debug - Arguments: P_1_L_2={P_1_L_2[:20]}...,")
    print(f"level1sum={level1sum[:20]}...")
    print(f"engine2={engine2[:20]}...")
    print("-----------------------------------------------------")
    sys.stdout.flush()

    try:
        sec_summary = run_prompt(P_1_L_2, level1sum, engine2, max_tokens_num=5000)
        if isinstance(sec_summary, str):
            sec_summary = ast.literal_eval(sec_summary)
        level2sum = sec_summary

    except Exception as e:
        print(f"Exception occurred: {e}")
        if hasattr(e, "response"):
            print(f"Debug - Exception Response: {e.response.content}")

    return summary_list, level2sum


def main():
    dt_string = datetime.now().strftime("%Y%m%d%H%M%S")

    script_dir = os.path.dirname(os.path.realpath(__file__))
    inputfolder = os.path.join(
        script_dir, "../..", "server/src/services", "input_folder"
    )
    outputfolder = os.path.join(
        script_dir, "../..", "server/src/services", "output_folder"
    )

    if not os.path.exists(inputfolder):
        os.makedirs(inputfolder, exist_ok=True)
    if not os.path.exists(outputfolder):
        os.makedirs(outputfolder, exist_ok=True)

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

    hosts = ["Wes P", "Gabrielle G", "Bridget D"]
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

    with open(
        os.path.join(outputfolder, "detailed-summary.json"), "w", encoding="utf-8"
    ) as f:
        json.dump({"Level1Summary": level1}, f, ensure_ascii=False, indent=4)

    with open(
        os.path.join(outputfolder, "overall-summary.json"), "w", encoding="utf-8"
    ) as f:
        json.dump({"Level2Summary": level2}, f, ensure_ascii=False, indent=4)

    with open(os.path.join(outputfolder, ".done"), "w") as f:
        f.write("done")

    logging.basicConfig(level=logging.INFO)
    logging.info("Level 1 and Level 2 summaries have been saved.")
    sys.stdout.flush()


if __name__ == "__main__":
    main()

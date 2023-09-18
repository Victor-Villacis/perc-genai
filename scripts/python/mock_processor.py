import shutil
import os
import time


def move_json_files():
    print("Script started...")

    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.realpath(__file__))

    # Construct the relative path to the output folder
    output_folder = os.path.join(
        script_dir, "../..", "server/src/services", "output_folder"
    )

    print(f"Output folder: {output_folder}")

    # Make sure the output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Paths to the JSON files to be moved
    json_files = ["detailed-summary.json", "overall-summary.json"]

    # Path to the JSON folder
    json_folder = os.path.join(script_dir, "JSON")

    for json_file in json_files:
        source_path = os.path.join(json_folder, json_file)
        destination_path = os.path.join(output_folder, json_file)

        # Introduce a 2-second delay
        print(f"Waiting for 2 seconds before moving {json_file}...")
        time.sleep(2)

        # Check if the source JSON file exists
        if os.path.exists(source_path):
            # Move the JSON file to the output folder
            shutil.move(source_path, destination_path)
            print(f"Moved {json_file} to {output_folder}")
        else:
            print(f"{json_file} not found.")

    print("Script ran successfully.")


# Uncomment the line below to test the function
move_json_files()

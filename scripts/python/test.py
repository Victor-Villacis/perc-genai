import pandas as pd


def main():
    data = {"Name": ["Alice", "Bob", "Charlie"], "Age": [25, 30, 35]}
    df = pd.DataFrame(data)
    print(df)


if __name__ == "__main__":
    main()

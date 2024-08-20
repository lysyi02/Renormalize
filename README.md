# Renormalize - Email classifier

**Overview:**  
Script reads users from `users.json` and identifies related emails from `sample_data.json` based on similarity to known user emails. The results are saved as "recognized" (similar emails) and "not_recognized" (unmatched emails) in a JSON file.

**Example:**
Given a user with the email `michael.scott@renormale.com`, possible related emails might include:

- `michael.scott@gmail.com`
- `mich34dwe46ael.scott@outlook.com`
- `michael236scott@yahoo.com`
- `mi.scott@gmail.com`

The results are saved in a JSON file with the following structure:

```
{
  "recognized": [
    {
      "user_email": "michael.scott@renormale.com",
      "related_emails": [
        "michael.scott@gmail.com",
        "mich34dwe46ael.scott@outlook.com"
      ]
    }
  ],
  "not_recognized": [
    "unknown@example.com",
    "another_unknown@example.com"
  ]
}
```

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

### 1. Using Docker Compose (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/lysyi02/Renormalize.git
```

2. Set up enviroment variables:

```bash
cp .env.example .env
```

3. Build service:

```bash
docker compose build
```

4. Create and start container to run script:

```bash
docker compose up
```

### 2. Manual Installation

1. Clone the repository:

```bash
git clone https://github.com/lysyi02/Renormalize.git
```

2. Set up enviroment variables:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
npm install
```

4. Compile TypeScript code:

```bash
npx tsc
```

5. Run compiled script:

```bash
node ./build/index.js
```

## Usage

- Run the script according to your chosen installation method.
- The result will be written to `results/output.json`.
- Modify the `.env` file if you need to specify different input/output files or adjust the **similarity threshold** to improve email recognition.

### What is the similarity threshold?

The script classifies emails using the [Dice-Sørensen coefficient](https://www.npmjs.com/package/string-similarity-js) algorithm. This algorithm may detect weak similarities (typically with a similarity rate between 0 and 0.3) between unrelated emails. Related emails generally have a higher similarity rate (0.7+).

The script uses a threshold value for classification. Emails with a similarity rate below the threshold will be classified as 'not*recognized' (\_Default threshold = 0.5*).

You can inspect the `classified-dataset.json` output file to determine the appropriate similarity threshold. For example, in the provided dataset (sorted by `similarity`), we observe unrelated emails with maximum similarity rate of `0.24` and related emails with minimal similarity rate of `0.7`. This suggests setting the threshold between these values.

```
{
"email": "ipujhperic@hotmail.com",
"mostSimilarEmail": "jim.halpert@dundermifflin.com",
"similarity": 0.21052631578947367
},
{
"email": "beswvhexl@yahoo.com",
"mostSimilarEmail": "pam.beesly@dundermifflin.com",
"similarity": 0.23529411764705882
},
{
"email": "rayan.6000netfgov121@outlook.com",
"mostSimilarEmail": "rayan.gov121@dundermifflin.com",
"similarity": 0.7
},
{
"email": "rayan.go4527pddhv121@example.com",
"mostSimilarEmail": "rayan.gov121@dundermifflin.com",
"similarity": 0.7
}
```

## License

This project is licensed under the [MIT License](LICENSE).

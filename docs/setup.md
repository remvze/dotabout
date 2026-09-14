## Setup Your Dotabout Profile

Setting up your Dotabout profile is quick and account-free. Just follow these steps:

### 1. Create a `.about` Repository

Create a public repository in your GitHub account with the name:

```
.about
```

> Note: The name must be exactly `.about`, including the leading dot.

### 2. Add an `about.json` File

Inside the `.about` repository, create a file named:

```
about.json
```

This file contains all the data shown on your Dotabout profile.

### 3. Fill in Your About Data

Here is a basic example of what your `about.json` might look like:

```json
{
  "version": 1,
  "name": "Your Name",
  "description": "A short description",
  "sections": [
    {
      "title": "Socials",
      "type": "links",
      "links": [
        {
          "title": "Website",
          "url": "https://example.com"
        },
        {
          "title": "GitHub",
          "url": "https://github.com/example"
        }
      ]
    },
    {
      "title": "Stack",
      "type": "stack",
      "stack": ["Astro", "TypeScript", "React"]
    }
  ]
}
```

> You can customize this with more fields and sections. See the [full schema](/schema.md) for details.

### You're Live

Once your `.about` repo and `about.json` file are public, your Dotabout profile is live at:

```
https://dotabout.me/@your-github-username
```

To update your profile, simply edit your `about.json` file.

> Note: GitHub may cache your `about.json` file, so changes might take a few minutes to appear on your Dotabout profile.

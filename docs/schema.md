## `about.json` Schema

Your `about.json` file defines what appears on your Dotabout profile. Below is a breakdown of its structure and how to use each part.

### Top-Level Fields

| Field         | Type   | Required | Description                                |
| ------------- | ------ | -------- | ------------------------------------------ |
| `name`        | string | Yes      | Your full name or display name.            |
| `description` | string | Yes      | A short tagline or summary of who you are. |
| `sections`    | array  | No       | Optional content blocks for your profile.  |
| `style`       | object | No       | Customize font and theme.                  |

---

### Sections

The `sections` field is an array of content blocks. Each block must be one of the following section types.

#### 1. List Section

Displays a list of items, such as work experience, projects, or publications.

```json
{
  "title": "Projects",
  "type": "list",
  "items": [
    {
      "title": "Project One",
      "description": "An open-source project.",
      "url": "https://github.com/yourname/one",
      "date": "2025"
    }
  ]
}
```

| Field                 | Type   | Required | Description                            |
| --------------------- | ------ | -------- | -------------------------------------- |
| `title`               | string | Yes      | Section title, for example "Projects". |
| `type`                | string | Yes      | Must be `"list"`.                      |
| `items`               | array  | Yes      | List of entries in the section.        |
| `items[].title`       | string | Yes      | Title of the entry.                    |
| `items[].description` | string | No       | Short description.                     |
| `items[].url`         | string | No       | Optional link.                         |
| `items[].date`        | string | No       | Optional date, for example a year.     |

---

#### 2. Text Section

Displays a block of plain text.

```json
{
  "title": "About Me",
  "type": "text",
  "content": "I'm a developer who loves building open tools for the web."
}
```

| Field     | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `title`   | string | Yes      | Section title.    |
| `type`    | string | Yes      | Must be `"text"`. |
| `content` | string | Yes      | The text content. |

---

#### 3. Links Section

Displays a group of external links, like social media or portfolios.

```json
{
  "title": "Connect",
  "type": "links",
  "links": [
    {
      "title": "GitHub",
      "url": "https://github.com/yourname"
    }
  ]
}
```

| Field           | Type   | Required | Description          |
| --------------- | ------ | -------- | -------------------- |
| `title`         | string | Yes      | Section title.       |
| `type`          | string | Yes      | Must be `"links"`.   |
| `links`         | array  | Yes      | List of links.       |
| `links[].title` | string | Yes      | Label for the link.  |
| `links[].url`   | string | Yes      | The URL of the link. |

---

#### 4. Stack Section

Displays a compact row of text pills, useful for tech stacks, tools, or skills.

```json
{
  "title": "Stack",
  "type": "stack",
  "stack": ["Astro", "TypeScript", "React"]
}
```

| Field     | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| `title`   | string | Yes      | Section title.                |
| `type`    | string | Yes      | Must be `"stack"`.            |
| `stack`   | array  | Yes      | List of short text items.     |
| `stack[]` | string | Yes      | A single stack label or tool. |

---

### Style

Customize your profile's appearance.

```json
"style": {
  "font": "serif",
  "theme": "dark"
}
```

| Field   | Type   | Options                   | Description           |
| ------- | ------ | ------------------------- | --------------------- |
| `font`  | string | `"serif"`, `"sans-serif"` | Choose a font style.  |
| `theme` | string | `"light"`, `"dark"`       | Choose a color theme. |

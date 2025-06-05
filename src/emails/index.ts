import fs from "fs";
import path from "path";

export function loadTemplate(templateName: string): string {
  const templatePath = path.join(__dirname, "templates", templateName);
  return fs.readFileSync(templatePath, "utf-8");
}

export function renderTemplate(template: string, variables: Record<string, string>): string {
  let output = template;
  for (const [key, value] of Object.entries(variables)) {
    output = output.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return output;
}
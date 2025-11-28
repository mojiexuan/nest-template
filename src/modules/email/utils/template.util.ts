import * as fs from 'fs';
import * as path from 'path';

/**
 * 邮件模板工具类
 */
export class EmailTemplateUtil {
  /**
   * 读取模板文件
   * @param templateName - 模板文件名（不含扩展名）
   * @returns 模板内容
   */
  static readTemplate(templateName: string): string {
    const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
    return fs.readFileSync(templatePath, 'utf-8');
  }

  /**
   * 渲染模板
   * @param template - 模板内容
   * @param data - 替换数据
   * @returns 渲染后的HTML
   */
  static render(template: string, data: Record<string, string>): string {
    let result = template;
    Object.keys(data).forEach((key) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), data[key]);
    });
    return result;
  }

  /**
   * 读取并渲染模板
   * @param templateName - 模板文件名（不含扩展名）
   * @param data - 替换数据
   * @returns 渲染后的HTML
   */
  static renderTemplate(templateName: string, data: Record<string, string>): string {
    const template = this.readTemplate(templateName);
    return this.render(template, data);
  }
}

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Results, CompanyFormData } from '@/types';

// html2canvasの型定義を拡張
interface Html2CanvasOptions {
  scale?: number;
  useCORS?: boolean;
  allowTaint?: boolean;
  backgroundColor?: string;
  logging?: boolean;
  width?: number;
  height?: number;
  windowWidth?: number;
  windowHeight?: number;
  foreignObjectRendering?: boolean;
  onclone?: (clonedDoc: Document) => void;
}

export class PDFGenerator {
  private pdf: jsPDF;

  constructor() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
  }

  // 日本語対応の基本的なテキストベースPDF生成
  generateBasicPDF(
    companyData: CompanyFormData,
    results: Results
  ): void {
    let yPosition = 20;
    const lineHeight = 8;
    const margin = 20;
    const pageWidth = this.pdf.internal.pageSize.width;
    const maxWidth = pageWidth - (margin * 2);

    // 英語でタイトルを作成（日本語フォント問題回避）
    this.pdf.setFontSize(16);
    this.pdf.text('Customer Analysis Report', margin, yPosition);
    yPosition += lineHeight * 2;

    // 日本語文字を画像として挿入するか、英語で代替
    this.pdf.setFontSize(12);
    this.pdf.text(`Company: ${companyData.companyName}`, margin, yPosition);
    yPosition += lineHeight;
    this.pdf.text(`Department: ${companyData.departmentName || 'N/A'}`, margin, yPosition);
    yPosition += lineHeight;
    this.pdf.text(`Position: ${companyData.positionName || 'N/A'}`, margin, yPosition);
    yPosition += lineHeight;
    this.pdf.text(`Scope: ${companyData.jobScope || 'N/A'}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // 英語のセクションタイトルで内容を追加
    const sections = [
      { title: "Securities Report Summary", content: results.summary },
      { title: "Hypothesis & Issues", content: results.hypothesis },
      { title: "Solution Matching", content: results.matching_result },
      { title: "Hearing Items", content: results.hearing_items }
    ];

    for (const section of sections) {
      if (section.content) {
        yPosition = this.addEnglishSection(section.title, section.content, yPosition, maxWidth);
      }
    }

    // 生成日時を追加
    const now = new Date();
    this.pdf.setFontSize(10);
    this.pdf.text(`Generated: ${now.toLocaleDateString()}`, margin, this.pdf.internal.pageSize.height - 10);

    // PDFをダウンロード
    this.pdf.save(`${companyData.companyName}_analysis_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.pdf`);
  }

  private addEnglishSection(title: string, content: string, yPosition: number, maxWidth: number): number {
    const lineHeight = 6;
    const margin = 20;

    // セクションタイトル
    this.pdf.setFontSize(14);
    this.pdf.text(title, margin, yPosition);
    yPosition += lineHeight * 1.5;

    if (!content) {
      this.pdf.setFontSize(10);
      this.pdf.text('No data available', margin, yPosition);
      return yPosition + lineHeight * 2;
    }

    // 日本語を含むコンテンツの場合、注記を追加
    this.pdf.setFontSize(10);
    if (/[ひらがなカタカナ漢字]/.test(content)) {
      this.pdf.text('* This section contains Japanese text. Please refer to the web interface for full content.', margin, yPosition);
      yPosition += lineHeight;
      
      // 英数字のみを抽出して表示
      const englishContent = content.replace(/[^\x00-\x7F]/g, ' ').replace(/\s+/g, ' ').trim();
      if (englishContent) {
        const lines = this.pdf.splitTextToSize(englishContent.substring(0, 500) + '...', maxWidth);
        for (const line of lines.slice(0, 5)) { // 最初の5行のみ
          if (yPosition > this.pdf.internal.pageSize.height - 30) {
            this.pdf.addPage();
            yPosition = 20;
          }
          this.pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        }
      }
    } else {
      // 英語のみの場合はそのまま表示
      const lines = this.pdf.splitTextToSize(content, maxWidth);
      for (const line of lines) {
        if (yPosition > this.pdf.internal.pageSize.height - 30) {
          this.pdf.addPage();
          yPosition = 20;
        }
        this.pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      }
    }

    return yPosition + lineHeight;
  }

  // フォント読み込み完了を待つ関数
  private async waitForFonts(): Promise<void> {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      try {
        await document.fonts.ready;
        // 追加で少し待機
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn('Font loading check failed:', error);
      }
    } else {
      // document.fontsがサポートされていない場合は固定時間待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // HTML要素をPDFに変換（高品質・日本語対応・型安全）
  async generateHTMLToPDF(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('指定された要素が見つかりません');
    }

    try {
      // フォントの読み込み完了を待つ
      await this.waitForFonts();

      // 一時的にフォントを強制設定
      const originalStyle = element.style.cssText;
      element.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
      
      // html2canvasのオプションを型安全に設定
      const options: Html2CanvasOptions = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: 1200,
        windowHeight: element.scrollHeight,
        foreignObjectRendering: true,
        onclone: (clonedDoc: Document) => {
          // クローンされたドキュメントにフォント設定を適用
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
            
            // 全ての子要素にもフォントを適用
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el: Element) => {
              if (el instanceof HTMLElement) {
                el.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
              }
            });
          }
        }
      };

      // 高解像度で日本語フォントを含む画像を生成
      const canvas = await html2canvas(element, options as any);

      // 元のスタイルを復元
      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/png', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4の幅（mm）
      const pageHeight = 295; // A4の高さ（mm）
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 最初のページに画像を追加
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // 複数ページにまたがる場合
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('PDF生成エラー:', error);
      throw new Error('PDF生成に失敗しました');
    }
  }
}

// ユーティリティ関数
export const generateAnalysisReport = (
  companyData: CompanyFormData,
  results: Results
): void => {
  const generator = new PDFGenerator();
  generator.generateBasicPDF(companyData, results);
};

export const generateHTMLReport = async (elementId: string): Promise<void> => {
  const generator = new PDFGenerator();
  const now = new Date();
  const filename = `analysis_report_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.pdf`;
  
  await generator.generateHTMLToPDF(elementId, filename);
};
export class CodeGenerator {
  private char_Upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private char_Lower = 'abcdefghijklmnopqrstuvwxyz';
  private char_Number = '0123456789';
  /**
   * Length must be Less than 30 If you enter a length more than 30 it will be as default 30
   */

  constructor(private length: number) {
    this.setLength(this.length);
  }

  private setLength(length: number): number {
    if (length > 30) {
      this.length = 29;
    } else {
      this.length = length;
    }
    return this.length;
  }

  private generateFrom(chars: string): string {
    let code = '';
    for (let i = 0; i < this.length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }
    return code;
  }

  generateWithUpper(): string {
    return this.generateFrom(this.char_Upper);
  }

  generateWithLower(): string {
    return this.generateFrom(this.char_Lower);
  }

  generateWithNumbers(): string {
    return this.generateFrom(this.char_Number);
  }

  generateWithUpperAndNumbers(): string {
    return this.generateFrom(this.char_Upper + this.char_Number);
  }

  generateWithLowerAndNumbers(): string {
    return this.generateFrom(this.char_Lower + this.char_Number);
  }

  generateWithUpperLowerAndNumbers(): string {
    return this.generateFrom(
      this.char_Upper + this.char_Lower + this.char_Number,
    );
  }
}

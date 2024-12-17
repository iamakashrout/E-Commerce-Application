// import { Request, Response } from 'express';

// export const verifyReceipt = (
//   parsedText: string,
//   selectedProductName: string,
//   selectedCompanyName: string
// ): string => {
//   // Step 1: Normalize the OCR text
//   const normalizedText = parsedText
//     .replace(/\r\n/g, '\n') // Replace carriage return with newline
//     .replace(/\s+/g, ' ') // Remove excessive whitespace
//     .toLowerCase(); // Convert to lowercase for case-insensitive comparison

//   // Step 2: Check if both product and company names are present
//   const isCompanyNamePresent = normalizedText.includes(
//     selectedCompanyName.toLowerCase()
//   );
//   const isProductNamePresent = normalizedText.includes(
//     selectedProductName.toLowerCase()
//   );

//   // Step 3: Return the result
//   if (isCompanyNamePresent && isProductNamePresent) {
//     return 'verified';
//   } else {
//     return 'not verified';
//   }
// };


// export const validateReceipt = (req: Request, res: Response): void => {
//   const { parsedText, selectedProductName, selectedCompanyName } = req.body;

//   if (!parsedText || !selectedProductName || !selectedCompanyName) {
//     res.status(400).json({ success: false, error: 'Missing required fields' });
//     return;
//   }

//   const result = verifyReceipt(parsedText, selectedProductName, selectedCompanyName);
//   res.status(200).json({ success: true, result });
// };

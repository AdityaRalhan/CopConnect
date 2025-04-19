// backend/controllers/faqController.js
import FAQ from '../models/faqModel.js';

// Get all FAQs
export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
};

// Get answer by question text
export const getFAQByQuestion = async (req, res) => {
  const { question } = req.params;

  try {
    const faq = await FAQ.findOne({ question });

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ answer: faq.answer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch answer' });
  }
};

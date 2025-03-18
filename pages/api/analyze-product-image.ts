import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, ProductAnalysis } from '@/lib/types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ProductAnalysis>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const analysis: ProductAnalysis = {
      id: Date.now().toString(),
      productId: 'temp-' + Date.now(),
      confidence: 0.95,
      labels: ['example'],
      metadata: {},
      createdAt: new Date()
    };

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Failed to analyze image:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

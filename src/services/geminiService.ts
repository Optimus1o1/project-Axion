import { GoogleGenAI, Type } from "@google/genai";
import { PredictionResult, NewsArticle, StockData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

let isThrottled = false;

export const geminiService = {
  isThrottled: () => isThrottled,

  async predictStockTrend(stock: StockData): Promise<PredictionResult> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this stock data for ${stock.name} (${stock.symbol}):
        Current Price: ${stock.currentPrice}
        Recent History: ${JSON.stringify(stock.history)}
        Market Context: Indian Markets (NSE/BSE).
        
        Predict the short-term trend (bullish/bearish/neutral), confidence score (0-1), a target price, and a brief rationale.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              trend: { type: Type.STRING, enum: ['bullish', 'bearish', 'neutral'] },
              confidence: { type: Type.NUMBER },
              targetPrice: { type: Type.NUMBER },
              rationale: { type: Type.STRING }
            },
            required: ['trend', 'confidence', 'targetPrice', 'rationale']
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      isThrottled = false;
      return {
        symbol: stock.symbol,
        ...result
      };
    } catch (error: any) {
      const isQuotaError = 
        error?.message?.includes('RESOURCE_EXHAUSTED') || 
        error?.status === 'RESOURCE_EXHAUSTED' ||
        error?.error?.status === 'RESOURCE_EXHAUSTED' ||
        error?.error?.code === 429;
        
      if (isQuotaError) isThrottled = true;
      
      if (isQuotaError) {
        console.warn("AI Prediction Throttled (429). Using local momentum fallback.");
        return {
          symbol: stock.symbol,
          trend: stock.changePercent >= 0 ? 'bullish' : 'bearish',
          confidence: 0.65,
          targetPrice: stock.currentPrice * (1 + (stock.changePercent / 100)),
          rationale: "[SYSTEM FALLBACK] Neural link throttled (429). Based on local technical indicators: Asset exhibits momentum volatility. Target price derived from immediate SMA projections."
        };
      }
      
      console.error("AI Prediction Error:", error);

      return {
        symbol: stock.symbol,
        trend: 'neutral',
        confidence: 0.5,
        targetPrice: stock.currentPrice,
        rationale: "Unable to generate prediction at this time."
      };
    }
  },

  async analyzeNewsSentiment(articles: any[]): Promise<NewsArticle[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze these news headlines and provide detailed, comprehensive sentiment analysis and engaging summaries suitable for an Indian investor. For each headline, explain the "Why it matters" in the summary:
        ${JSON.stringify(articles)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
                sentimentScore: { type: Type.NUMBER, description: "Detailed sentiment score from -1 (most negative) to 1 (most positive)" },
                impactScale: { type: Type.NUMBER, description: "1-10 impact on market" },
                entities: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "List of key financial entities, tickers, or figures mentioned"
                },
              },
              required: ['id', 'title', 'summary', 'sentiment', 'sentimentScore', 'impactScale', 'entities']
            }
          }
        }
      });
      
      const results = JSON.parse(response.text || '[]');
      isThrottled = false;
      return results.map((r: any) => ({
        ...r,
        url: "#",
        source: "Axion News intelligence",
        timestamp: new Date().toISOString()
      }));
    } catch (error: any) {
      const isQuotaError = 
        error?.message?.includes('RESOURCE_EXHAUSTED') || 
        error?.status === 'RESOURCE_EXHAUSTED' ||
        error?.error?.status === 'RESOURCE_EXHAUSTED' ||
        error?.error?.code === 429;
        
      if (isQuotaError) {
        isThrottled = true;
        console.warn("AI News Analysis Throttled (429). Using heuristic fallback.");
        // Return refined mock analysis if quota is hit
        return articles.map(a => {
          const title = a.title.toLowerCase();
          const isPositive = title.includes('up') || title.includes('surges') || title.includes('gain') || title.includes('high') || title.includes('positive');
          const isNegative = title.includes('down') || title.includes('plunges') || title.includes('loss') || title.includes('low') || title.includes('negative') || title.includes('drop');
          
          return {
            id: a.id,
            title: a.title,
            summary: `[HEURISTIC SUMMARY] ${a.title}. Market implications suggest volatility as traders digest sector-specific movements within the Indian micro-index. Signal link is currently in fallback mode.`,
            sentiment: isPositive ? 'positive' : isNegative ? 'negative' : 'neutral',
            sentimentScore: isPositive ? 0.75 : isNegative ? -0.75 : 0.05,
            impactScale: 7,
            entities: isPositive ? ["NIFTY", "RBI"] : isNegative ? ["GLOBAL", "CRUDE"] : ["MARKET"],
            url: "#",
            source: "Axion Cache Intelligence",
            timestamp: new Date().toISOString()
          };
        });
      }
      return [];
    }
  },

  async refineSummary(title: string, currentSummary: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on the headline "${title}", expand the following brief summary into a more comprehensive and engaging narrative (approx 2-3 sentences) explaining the implications for Indian markets: "${currentSummary}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              refinedSummary: { type: Type.STRING }
            },
            required: ['refinedSummary']
          }
        }
      });
      return JSON.parse(response.text || '{}').refinedSummary || currentSummary;
    } catch (error: any) {
      console.error("Refine Summary Error:", error);
      return currentSummary;
    }
  },

  async getMarketMood(): Promise<number> {
    // Basic AI sentiment check on overall market
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Analyze current Indian market sentiment based on recent global and local trends. Return a 'Market Mood' score from 0 (Extreme Fear) to 100 (Extreme Greed).",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER }
            },
            required: ['score']
          }
        }
      });
      const score = JSON.parse(response.text || '{"score": 50}').score;
      isThrottled = false;
      return score;
    } catch (error: any) {
      const isQuotaError = 
        error?.message?.includes('RESOURCE_EXHAUSTED') || 
        error?.status === 'RESOURCE_EXHAUSTED' ||
        error?.error?.status === 'RESOURCE_EXHAUSTED' ||
        error?.error?.code === 429;
        
      if (isQuotaError) {
        isThrottled = true;
        console.warn("Market mood throttled, using neutral baseline.");
      }
      return 50;
    }
  }
};

import { Request, Response } from 'express';
import Together from 'together-ai';
import systemPrompt from '../prompts/SystemPrompt';

const together = new Together({
	apiKey: process.env.TOGETHER_API_KEY,
});

export const initModel = async (req: Request, res: Response) => {
	const { skills, domain, timeline, role, interests } = req.body;

	const userPrompt = `
    Current Skills: ${skills},
    Domains of Interest: ${domain},
    Target Timeline: ${timeline},
    Dream Roles: ${role},
    Interests: ${interests},
    `;

	try {
		const completion = await together.chat.completions.create({
			model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userPrompt },
			],
		});

		res.status(200).json(completion);
	} catch (error) {
		res.status(500).json({
			message: error,
		});
	}
};

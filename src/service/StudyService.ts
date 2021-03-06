import { Request, Response, Router } from 'express'
import { Study } from '../model/Study'
import { StudyRepository } from '../repository/StudyRepository'
import { SecurityContext, ActionContext, _verify } from './Security'
import jsonata from 'jsonata'

export const StudyService = Router()
StudyService.post('/researcher/:researcher_id/study', async (req: Request, res: Response) => {
	try {
		let researcher_id = req.params.researcher_id
		let study = req.body
		researcher_id = await _verify(req, res, ['self', 'sibling', 'parent'], researcher_id)
		let output = { data: await StudyRepository._insert(researcher_id, study) }
		res.json(output)
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})
StudyService.put('/study/:study_id', async (req: Request, res: Response) => {
	try {
		let study_id = req.params.study_id
		let study = req.body
		study_id = await _verify(req, res, ['self', 'sibling', 'parent'], study_id)
		let output = { data: await StudyRepository._update(study_id, study) }
		res.json(output)
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})
StudyService.delete('/study/:study_id', async (req: Request, res: Response) => {
	try {
		let study_id = req.params.study_id
		study_id = await _verify(req, res, ['self', 'sibling', 'parent'], study_id)
		let output = { data: await StudyRepository._delete(study_id) }
		output = typeof req.query.transform === 'string' ? jsonata(req.query.transform).evaluate(output) : output
		res.json()
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})
StudyService.get('/study/:study_id', async (req: Request, res: Response) => {
	try {
		let study_id = req.params.study_id
		study_id = await _verify(req, res, ['self', 'sibling', 'parent'], study_id)
		let output = { data: await StudyRepository._select(study_id) }
		output = typeof req.query.transform === 'string' ? jsonata(req.query.transform).evaluate(output) : output
		res.json(output)
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})
StudyService.get('/researcher/:researcher_id/study', async (req: Request, res: Response) => {
	try {
		let researcher_id = req.params.researcher_id
		researcher_id = await _verify(req, res, ['self', 'sibling', 'parent'], researcher_id)
		let output = { data: await StudyRepository._select(researcher_id) }
		output = typeof req.query.transform === 'string' ? jsonata(req.query.transform).evaluate(output) : output
		res.json(output)
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})
StudyService.get('/study', async (req: Request, res: Response) => {
	try {
		let _ = await _verify(req, res, [])
		let output = { data: await StudyRepository._select() }
		output = typeof req.query.transform === 'string' ? jsonata(req.query.transform).evaluate(output) : output
		res.json(output)
	} catch(e) {
		res.status(parseInt(e.message.split('.')[0]) || 500).json({ error: e.message })
	}
})

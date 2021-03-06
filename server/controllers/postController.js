const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Post = require('../models/Post');
module.exports.createPost = (req, res) => {
	const form = formidable({ multiples: true });
	form.parse(req, async (error, fields, files) => {
		const { title, body, description, slug, id, name } = fields;
		const errors = [];
		if (title === '') {
			errors.push({ msg: 'Title is required' });
		}
		if (body === '') {
			errors.push({ msg: 'Body is required' });
		}
		if (description === '') {
			errors.push({ msg: 'Description is required' });
		}
		if (slug === '') {
			errors.push({ msg: 'Slug is required' });
		}
		if (Object.keys(files).length === 0) {
			errors.push({ msg: 'Image is required' });
		} else {
			const { type } = files.image;
			const split = type.split('/');
			const extension = split[1].toLowerCase();
			if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
				errors.push({ msg: `${extension} ` });
			} else {
				files.image.name = uuidv4() + '.' + extension;
			}
		}
		const checkSlug = await Post.findOne({ slug });
		if (checkSlug) {
			errors.push({ msg: "" });
		}
		if (errors.length !== 0) {
			return res.status(400).json({ errors, files });
		} else {
			const newPath =
				__dirname + `${files.image.name}`;
			fs.copyFile(files.image.path, newPath, async (error) => {
				if (!error) {
					try {
						const response = await Post.create({
							title,
							body,
							image: files.image.name,
							description,
							slug,
							userName: name,
							userId: id,
						});
						return res.status(200).json({
							msg: 'geç',
							response,
						});
					} catch (error) {
						return res.status(500).json({ errors: error, msg: error.message });
					}
				}
			});
		}
	});
};
module.exports.fetchPosts = async (req, res) => {
	const id = req.params.id;
	const page = req.params.page;
	const perPage = 3;
	const skip = (page - 1) * perPage;
	try {
		const count = await Post.find({ userId: id }).countDocuments();
		const response = await Post.find({ userId: id })
			.skip(skip)
			.limit(perPage)
			.sort({ updatedAt: -1 });
		return res.status(200).json({ response: response, count, perPage });
	} catch (error) {
		return res.status(500).json({ errors: error, msg: error.message });
	}
};
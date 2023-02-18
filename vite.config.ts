import { defineConfig } from "vite";
import { createHtmlPlugin } from 'vite-plugin-html'

const page_url = "https://heledron.com/tools/reuleaux-polygon-generator/"

const page_title					= "Reuleaux Polygon Generator";
const page_description		= "Generate images of Reuleaux polygons (Shapes of constant width)";
const page_author					= "Morgan";
const page_keywords				= "Heledron, Hadron, Cymaera, Reuleaux, Triangle, Polygon, Shapes, Figures, of, constant, width";
const page_og_title 				= page_title;
const page_og_description 	= page_description;
const page_og_url 					= page_url;
const page_og_image 				= page_og_url + "thumbnail.webp";
const page_og_type 					= "website";

export default defineConfig({
	base: "./",
	build: {
		modulePreload: {
			polyfill: false,
		},
	},
	plugins: [
		createHtmlPlugin({
			minify: true,
			inject: {
				data: {
					page_url,
					page_title,
					page_description,
					page_author,
					page_keywords,
					page_og_title,
					page_og_description,
					page_og_url,
					page_og_image,
					page_og_type,
				}
			}
		}),
	],
});
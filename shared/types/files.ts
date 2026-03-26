export type MetaData = {
	size: number;
	label: string;
	mimetype: string;
	created_at: string;
	updated_at: string;
	icon: {
		color: string;
		background: string;
	};
};

export type FileData = {
	id: string;
	name: string;
	published: boolean;
	media: string;
	metadata: MetaData;
	article_name: string;
};

export type FileType = {
	extension: string;
	label: string;
	color: string;
	background: string;
};

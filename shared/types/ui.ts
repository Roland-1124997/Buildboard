export type Anchor = {
	id: string;
	level: number;
	itemIndex: number;
	textContent: string;
};

export type search = {
	label: string;
	placeholder: string;
};

export type Filters = {
	type: string;
	iconName: string;
	label: string;
	shortLabel: string;
	alwaysShowLabel: boolean;
	ariaLabel: string;
	color: string;
	large: boolean;
};

export type Buttons = {
	iconName?: string;
	to?: string;
	description?: string;
	isSmall?: boolean;
	isButton?: boolean;
	onClick?: "triggerFileSelect" | "refresh" | "subscribe" | "unsubscribe";
};

export type ToolBar = {
	groupWithFilters?: boolean;
	fallbackFilter?: string;
	buttons?: Buttons[];
	filters?: Filters[];
	search?: search;
	store: string;
};

export type RouteType = {
	hidden?: boolean;
	label: string;
	iconName: string;
	refetchOnEnter?: boolean;
	alert?: boolean;
	toolbar?: ToolBar;
	related?: string[];
};

export type ArticleContent = {
	type: "doc";
	content: Record<string, any>[];
};

export type Article = {
	created_at: string;
	updated_at: string;
	words: number;
	read_time: string;
	content: ArticleContent;
	anchors: Anchor[];
	id: string;
	title: string;
	description: string;
	topics: string[];
	published: boolean;
	thumbnail_url: string;
};

export type Inbox = {
	id: string;
	threadId: string;
	uid: number;
	subject: string;
	date: string;
	from: {
		name: string;
		address: string;
	};
	flags: string[];
	attachments: any[];
	preview: string;
	html: string;
	references?: string[];
};

export type StatusHistoryItem = {
	day: string;
	status: string;
	downtime_duration: number;
	maintenance_duration: number;
};

export type MonitorResource = {
	position?: number;
	attributes: {
		public_name: string;
		explanation?: string;
		status: string;
		position: number;
		availability: number;
		last_checked_at: string;
		status_history: StatusHistoryItem[];
		status_page_section_name: string;
		status_page_section_id: number;
		resource_type: string;
	};
};

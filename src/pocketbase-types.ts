/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export const Collections = {
	Authorigins: "_authOrigins",
	Externalauths: "_externalAuths",
	Mfas: "_mfas",
	Otps: "_otps",
	Superusers: "_superusers",
	AllMediaSeries: "all_media_series",
	CollectedSeriesVolumes: "collected_series_volumes",
	CompletedMediaSeries: "completed_media_series",
	InDeliverySeriesVolumes: "in_delivery_series_volumes",
	IncompleteMediaSeries: "incomplete_media_series",
	MediaSeries: "media_series",
	MissingSeriesVolumes: "missing_series_volumes",
	OrphanedMediaSeries: "orphaned_media_series",
	ReleasedSeriesVolumes: "released_series_volumes",
	SeriesTags: "series_tags",
	SeriesVolumes: "series_volumes",
	UpcomingSeriesVolumes: "upcoming_series_volumes",
	Users: "users",
	VolumeTags: "volume_tags",
} as const
export type Collections = typeof Collections[keyof typeof Collections]

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export const AllMediaSeriesTypeOptions = {
	"Book": "Book",
	"Game": "Game",
	"Movie": "Movie",
	"Show": "Show",
} as const
export type AllMediaSeriesTypeOptions = typeof AllMediaSeriesTypeOptions[keyof typeof AllMediaSeriesTypeOptions]
export type AllMediaSeriesRecord<Thighest_volume_number = unknown> = {
	completed?: boolean
	created: IsoAutoDateString
	highest_volume_number?: null | Thighest_volume_number
	id: string
	name: string
	single_volume?: boolean
	tags?: RecordIdString[]
	type: AllMediaSeriesTypeOptions
	updated: IsoAutoDateString
}

export type CollectedSeriesVolumesRecord = {
	created: IsoAutoDateString
	id: string
	purchase_date?: IsoDateString
	release_date?: IsoDateString
	sequence_number: number
	series: RecordIdString
	shopping_link?: string
	tags?: RecordIdString[]
	updated: IsoAutoDateString
}

export const CompletedMediaSeriesTypeOptions = {
	"Book": "Book",
	"Game": "Game",
	"Movie": "Movie",
	"Show": "Show",
} as const
export type CompletedMediaSeriesTypeOptions = typeof CompletedMediaSeriesTypeOptions[keyof typeof CompletedMediaSeriesTypeOptions]
export type CompletedMediaSeriesRecord = {
	created: IsoAutoDateString
	id: string
	name: string
	single_volume?: boolean
	tags?: RecordIdString[]
	type: CompletedMediaSeriesTypeOptions
	updated: IsoAutoDateString
}

export type InDeliverySeriesVolumesRecord = {
	created: IsoAutoDateString
	id: string
	purchase_date?: IsoDateString
	release_date?: IsoDateString
	sequence_number: number
	series: RecordIdString
	shopping_link?: string
	tags?: RecordIdString[]
	updated: IsoAutoDateString
}

export const IncompleteMediaSeriesTypeOptions = {
	"Book": "Book",
	"Game": "Game",
	"Movie": "Movie",
	"Show": "Show",
} as const
export type IncompleteMediaSeriesTypeOptions = typeof IncompleteMediaSeriesTypeOptions[keyof typeof IncompleteMediaSeriesTypeOptions]
export type IncompleteMediaSeriesRecord<Thighest_volume_number = unknown> = {
	created: IsoAutoDateString
	highest_volume_number?: null | Thighest_volume_number
	id: string
	name: string
	single_volume?: boolean
	tags?: RecordIdString[]
	type: IncompleteMediaSeriesTypeOptions
	updated: IsoAutoDateString
}

export const MediaSeriesTypeOptions = {
	"Book": "Book",
	"Game": "Game",
	"Movie": "Movie",
	"Show": "Show",
} as const
export type MediaSeriesTypeOptions = typeof MediaSeriesTypeOptions[keyof typeof MediaSeriesTypeOptions]
export type MediaSeriesRecord = {
	completed?: boolean
	created: IsoAutoDateString
	id: string
	name: string
	single_volume?: boolean
	tags?: RecordIdString[]
	type: MediaSeriesTypeOptions
	updated: IsoAutoDateString
}

export type MissingSeriesVolumesRecord = {
	created: IsoAutoDateString
	id: string
	release_date?: IsoDateString
	sequence_number: number
	series: RecordIdString
	shopping_link?: string
	tags?: RecordIdString[]
	updated: IsoAutoDateString
}

export const OrphanedMediaSeriesTypeOptions = {
	"Book": "Book",
	"Game": "Game",
	"Movie": "Movie",
	"Show": "Show",
} as const
export type OrphanedMediaSeriesTypeOptions = typeof OrphanedMediaSeriesTypeOptions[keyof typeof OrphanedMediaSeriesTypeOptions]
export type OrphanedMediaSeriesRecord<Thighest_volume_number = unknown> = {
	created: IsoAutoDateString
	highest_volume_number?: null | Thighest_volume_number
	id: string
	name: string
	single_volume?: boolean
	tags?: RecordIdString[]
	type: OrphanedMediaSeriesTypeOptions
	updated: IsoAutoDateString
}

export type ReleasedSeriesVolumesRecord = {
	created: IsoAutoDateString
	id: string
	release_date?: IsoDateString
	sequence_number: number
	series: RecordIdString
	shopping_link?: string
	tags?: RecordIdString[]
	updated: IsoAutoDateString
}

export type SeriesTagsRecord = {
	created: IsoAutoDateString
	id: string
	label: string
	updated: IsoAutoDateString
}

export type SeriesVolumesRecord = {
	created: IsoAutoDateString
	id: string
	in_delivery?: boolean
	purchase_date?: IsoDateString
	release_date?: IsoDateString
	sequence_number: number
	series: RecordIdString
	shopping_link?: string
	tags?: RecordIdString[]
	updated: IsoAutoDateString
}

export type UpcomingSeriesVolumesRecord = {
	created: IsoAutoDateString
	id: string
	release_date?: IsoDateString
	sequence_number: number
	series: RecordIdString
	shopping_link?: string
	tags?: RecordIdString[]
	updated: IsoAutoDateString
}

export type UsersRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type VolumeTagsRecord = {
	created: IsoAutoDateString
	id: string
	label: string
	updated: IsoAutoDateString
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AllMediaSeriesResponse<Thighest_volume_number = unknown, Texpand = unknown> = Required<AllMediaSeriesRecord<Thighest_volume_number>> & BaseSystemFields<Texpand>
export type CollectedSeriesVolumesResponse<Texpand = unknown> = Required<CollectedSeriesVolumesRecord> & BaseSystemFields<Texpand>
export type CompletedMediaSeriesResponse<Texpand = unknown> = Required<CompletedMediaSeriesRecord> & BaseSystemFields<Texpand>
export type InDeliverySeriesVolumesResponse<Texpand = unknown> = Required<InDeliverySeriesVolumesRecord> & BaseSystemFields<Texpand>
export type IncompleteMediaSeriesResponse<Thighest_volume_number = unknown, Texpand = unknown> = Required<IncompleteMediaSeriesRecord<Thighest_volume_number>> & BaseSystemFields<Texpand>
export type MediaSeriesResponse<Texpand = unknown> = Required<MediaSeriesRecord> & BaseSystemFields<Texpand>
export type MissingSeriesVolumesResponse<Texpand = unknown> = Required<MissingSeriesVolumesRecord> & BaseSystemFields<Texpand>
export type OrphanedMediaSeriesResponse<Thighest_volume_number = unknown, Texpand = unknown> = Required<OrphanedMediaSeriesRecord<Thighest_volume_number>> & BaseSystemFields<Texpand>
export type ReleasedSeriesVolumesResponse<Texpand = unknown> = Required<ReleasedSeriesVolumesRecord> & BaseSystemFields<Texpand>
export type SeriesTagsResponse<Texpand = unknown> = Required<SeriesTagsRecord> & BaseSystemFields<Texpand>
export type SeriesVolumesResponse<Texpand = unknown> = Required<SeriesVolumesRecord> & BaseSystemFields<Texpand>
export type UpcomingSeriesVolumesResponse<Texpand = unknown> = Required<UpcomingSeriesVolumesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type VolumeTagsResponse<Texpand = unknown> = Required<VolumeTagsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	all_media_series: AllMediaSeriesRecord
	collected_series_volumes: CollectedSeriesVolumesRecord
	completed_media_series: CompletedMediaSeriesRecord
	in_delivery_series_volumes: InDeliverySeriesVolumesRecord
	incomplete_media_series: IncompleteMediaSeriesRecord
	media_series: MediaSeriesRecord
	missing_series_volumes: MissingSeriesVolumesRecord
	orphaned_media_series: OrphanedMediaSeriesRecord
	released_series_volumes: ReleasedSeriesVolumesRecord
	series_tags: SeriesTagsRecord
	series_volumes: SeriesVolumesRecord
	upcoming_series_volumes: UpcomingSeriesVolumesRecord
	users: UsersRecord
	volume_tags: VolumeTagsRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	all_media_series: AllMediaSeriesResponse
	collected_series_volumes: CollectedSeriesVolumesResponse
	completed_media_series: CompletedMediaSeriesResponse
	in_delivery_series_volumes: InDeliverySeriesVolumesResponse
	incomplete_media_series: IncompleteMediaSeriesResponse
	media_series: MediaSeriesResponse
	missing_series_volumes: MissingSeriesVolumesResponse
	orphaned_media_series: OrphanedMediaSeriesResponse
	released_series_volumes: ReleasedSeriesVolumesResponse
	series_tags: SeriesTagsResponse
	series_volumes: SeriesVolumesResponse
	upcoming_series_volumes: UpcomingSeriesVolumesResponse
	users: UsersResponse
	volume_tags: VolumeTagsResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase

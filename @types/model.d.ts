import { DateDataType, NumberDataType, StringDataType, TinyIntegerDataType } from "sequelize/types"

export interface MusicModel {
    id: NumberDataType
    title: StringDataType
    artistName: StringDataType
    albumName: StringDataType
    lead: TinyIntegerDataType
    createdAt: DateDataType
    updatedAt: DateDataType
    albumId: NumberDataType
    artistId: NumberDataType
}
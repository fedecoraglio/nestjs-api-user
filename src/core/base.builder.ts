abstract class Builder<Model, Dto> {
  abstract transformDtoToModel(dto: Dto): Model;
  abstract transformDtosToModels(dtos: Dto[]): Model[];

  abstract transformModelToDto(model: Model): Dto;
  abstract transformModelsToDtos(models: Model[]): Dto[];
}

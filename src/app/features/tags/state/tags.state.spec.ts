import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TagsState } from './tags.state';
import { defaultTagStateModel } from './tags.state.model';
import { SeriesTagModel } from '../model/series-tag.model';
import { VolumeTagModel } from '../model/volume-tag.model';
import { SeriesTags, VolumeTags } from './tags.state.actions';
import { GetAllSeriesTagUseCase } from '../use-cases/get-all.series-tag.use-case';
import { CreateSeriesTagUseCase } from '../use-cases/create.series-tag.use-case';
import { DeleteSeriesTagUseCase } from '../use-cases/delete.series-tag.use-case';
import { GetAllVolumeTagUseCase } from '../use-cases/get-all.volume-tag.use-case';
import { CreateVolumeTagUseCase } from '../use-cases/create.volume-tag.use-case';
import { DeleteVolumeTagUseCase } from '../use-cases/delete.volume-tag.use-case';
import { TagsStateSelectors } from './tags.state.selectors';
import { CreateSeriesTagModel } from '../model/create.series-tag.model';
import { CreateVolumeTagModel } from '../model/create.volume-tag.model';
import { firstValueFrom } from 'rxjs';

describe('TagsState', () => {
  let store: Store;
  let getAllSeriesTagUseCase: jest.Mocked<GetAllSeriesTagUseCase>;
  let createSeriesTagUseCase: jest.Mocked<CreateSeriesTagUseCase>;
  let deleteSeriesTagUseCase: jest.Mocked<DeleteSeriesTagUseCase>;
  let getAllVolumeTagUseCase: jest.Mocked<GetAllVolumeTagUseCase>;
  let createVolumeTagUseCase: jest.Mocked<CreateVolumeTagUseCase>;
  let deleteVolumeTagUseCase: jest.Mocked<DeleteVolumeTagUseCase>;

  const mockSeriesTag: SeriesTagModel = new SeriesTagModel({
    id: '1',
    label: 'Test Series Tag',
  });

  const mockVolumeTag: VolumeTagModel = new VolumeTagModel({
    id: '1',
    label: 'Test Volume Tag',
  });

  const mockSeriesTags: SeriesTagModel[] = [mockSeriesTag];
  const mockVolumeTags: VolumeTagModel[] = [mockVolumeTag];

  beforeEach(() => {
    const mockGetAllSeriesTagUseCase = {
      execute: jest.fn().mockResolvedValue(mockSeriesTags),
    };

    const mockCreateSeriesTagUseCase = {
      execute: jest.fn().mockImplementation((input: CreateSeriesTagModel) => {
        return Promise.resolve(
          new SeriesTagModel({
            id: 'new-series-tag-id',
            label: input.label,
          }),
        );
      }),
    };

    const mockDeleteSeriesTagUseCase = {
      execute: jest.fn().mockResolvedValue(true),
    };

    const mockGetAllVolumeTagUseCase = {
      execute: jest.fn().mockResolvedValue(mockVolumeTags),
    };

    const mockCreateVolumeTagUseCase = {
      execute: jest.fn().mockImplementation((input: CreateVolumeTagModel) => {
        return Promise.resolve(
          new VolumeTagModel({
            id: 'new-volume-tag-id',
            label: input.label,
          }),
        );
      }),
    };

    const mockDeleteVolumeTagUseCase = {
      execute: jest.fn().mockResolvedValue(true),
    };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([TagsState])],
      providers: [
        { provide: GetAllSeriesTagUseCase, useValue: mockGetAllSeriesTagUseCase },
        { provide: CreateSeriesTagUseCase, useValue: mockCreateSeriesTagUseCase },
        { provide: DeleteSeriesTagUseCase, useValue: mockDeleteSeriesTagUseCase },
        { provide: GetAllVolumeTagUseCase, useValue: mockGetAllVolumeTagUseCase },
        { provide: CreateVolumeTagUseCase, useValue: mockCreateVolumeTagUseCase },
        { provide: DeleteVolumeTagUseCase, useValue: mockDeleteVolumeTagUseCase },
      ],
    });

    store = TestBed.inject(Store);
    getAllSeriesTagUseCase = TestBed.inject(
      GetAllSeriesTagUseCase,
    ) as jest.Mocked<GetAllSeriesTagUseCase>;
    createSeriesTagUseCase = TestBed.inject(
      CreateSeriesTagUseCase,
    ) as jest.Mocked<CreateSeriesTagUseCase>;
    deleteSeriesTagUseCase = TestBed.inject(
      DeleteSeriesTagUseCase,
    ) as jest.Mocked<DeleteSeriesTagUseCase>;
    getAllVolumeTagUseCase = TestBed.inject(
      GetAllVolumeTagUseCase,
    ) as jest.Mocked<GetAllVolumeTagUseCase>;
    createVolumeTagUseCase = TestBed.inject(
      CreateVolumeTagUseCase,
    ) as jest.Mocked<CreateVolumeTagUseCase>;
    deleteVolumeTagUseCase = TestBed.inject(
      DeleteVolumeTagUseCase,
    ) as jest.Mocked<DeleteVolumeTagUseCase>;
  });

  it('should have initial state', () => {
    const state = store.selectSnapshot(TagsStateSelectors.stateModel);
    expect(state).toEqual(defaultTagStateModel);
  });

  describe('getAllSeriesTags', () => {
    it('should execute GetAll use-case and update seriesTags in state', async () => {
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));

      expect(getAllSeriesTagUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.seriesTags).toEqual(mockSeriesTags);
      expect(state.volumeTags).toEqual([]);
    });

    it('should handle empty series tags array', async () => {
      getAllSeriesTagUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));

      expect(getAllSeriesTagUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.seriesTags).toEqual([]);
      expect(state.volumeTags).toEqual([]);
    });

    it('should update seriesTags selector after GetAll action', async () => {
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));

      const seriesTags = store.selectSnapshot(TagsStateSelectors.seriesTags);
      expect(seriesTags).toEqual(mockSeriesTags);
    });

    it('should not affect volumeTags when getting series tags', async () => {
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));

      const volumeTags = store.selectSnapshot(TagsStateSelectors.volumeTags);
      expect(volumeTags).toEqual([]);
    });
  });

  describe('getAllVolumeTags', () => {
    it('should execute GetAll use-case and update volumeTags in state', async () => {
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      expect(getAllVolumeTagUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.volumeTags).toEqual(mockVolumeTags);
      expect(state.seriesTags).toEqual([]);
    });

    it('should handle empty volume tags array', async () => {
      getAllVolumeTagUseCase.execute.mockResolvedValueOnce([]);

      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      expect(getAllVolumeTagUseCase.execute).toHaveBeenCalledTimes(1);

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.volumeTags).toEqual([]);
      expect(state.seriesTags).toEqual([]);
    });

    it('should update volumeTags selector after GetAll action', async () => {
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      const volumeTags = store.selectSnapshot(TagsStateSelectors.volumeTags);
      expect(volumeTags).toEqual(mockVolumeTags);
    });

    it('should not affect seriesTags when getting volume tags', async () => {
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      const seriesTags = store.selectSnapshot(TagsStateSelectors.seriesTags);
      expect(seriesTags).toEqual([]);
    });
  });

  describe('getAllTags combined', () => {
    it('should maintain both series and volume tags in state after fetching both', async () => {
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.seriesTags).toEqual(mockSeriesTags);
      expect(state.volumeTags).toEqual(mockVolumeTags);
    });

    it('should allow fetching series tags multiple times', async () => {
      const newSeriesTags = [new SeriesTagModel({ id: '2', label: 'New Series Tag' })];

      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));
      getAllSeriesTagUseCase.execute.mockResolvedValueOnce(newSeriesTags);
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));

      expect(getAllSeriesTagUseCase.execute).toHaveBeenCalledTimes(2);

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.seriesTags).toEqual(newSeriesTags);
    });

    it('should allow fetching volume tags multiple times', async () => {
      const newVolumeTags = [new VolumeTagModel({ id: '2', label: 'New Volume Tag' })];

      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));
      getAllVolumeTagUseCase.execute.mockResolvedValueOnce(newVolumeTags);
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      expect(getAllVolumeTagUseCase.execute).toHaveBeenCalledTimes(2);

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.volumeTags).toEqual(newVolumeTags);
    });
  });

  describe('createSeriesTag', () => {
    it('should execute Create use-case and add series tag to state', async () => {
      const createModel = new CreateSeriesTagModel({ label: 'New Series Tag' });

      await firstValueFrom(store.dispatch(new SeriesTags.Create(createModel)));

      expect(createSeriesTagUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createSeriesTagUseCase.execute).toHaveBeenCalledWith(createModel);

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.seriesTags).toHaveLength(1);
      expect(state.seriesTags[0].label).toBe('New Series Tag');
      expect(state.volumeTags).toEqual([]);
    });

    it('should not affect volumeTags when creating series tag', async () => {
      const createModel = new CreateSeriesTagModel({ label: 'New Series Tag' });

      await firstValueFrom(store.dispatch(new SeriesTags.Create(createModel)));

      const volumeTags = store.selectSnapshot(TagsStateSelectors.volumeTags);
      expect(volumeTags).toEqual([]);
    });

    it('should not add tag if use case returns null', async () => {
      createSeriesTagUseCase.execute.mockResolvedValueOnce(null);
      const createModel = new CreateSeriesTagModel({ label: 'New Series Tag' });

      await firstValueFrom(store.dispatch(new SeriesTags.Create(createModel)));

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.seriesTags).toEqual([]);
    });
  });

  describe('deleteSeriesTag', () => {
    it('should execute Delete use-case and remove series tag from state', async () => {
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));

      await firstValueFrom(store.dispatch(new SeriesTags.Delete(mockSeriesTag.id)));

      expect(deleteSeriesTagUseCase.execute).toHaveBeenCalledTimes(1);
      expect(deleteSeriesTagUseCase.execute).toHaveBeenCalledWith(mockSeriesTag.id);

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.seriesTags).toEqual([]);
      expect(state.volumeTags).toEqual([]);
    });

    it('should not affect volumeTags when deleting series tag', async () => {
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));

      await firstValueFrom(store.dispatch(new SeriesTags.Delete(mockSeriesTag.id)));

      const volumeTags = store.selectSnapshot(TagsStateSelectors.volumeTags);
      expect(volumeTags).toEqual([]);
    });

    it('should not remove tag if use case returns false', async () => {
      deleteSeriesTagUseCase.execute.mockResolvedValueOnce(false);
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));

      await firstValueFrom(store.dispatch(new SeriesTags.Delete(mockSeriesTag.id)));

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.seriesTags).toEqual(mockSeriesTags);
    });
  });

  describe('createVolumeTag', () => {
    it('should execute Create use-case and add volume tag to state', async () => {
      const createModel = new CreateVolumeTagModel({ label: 'New Volume Tag' });

      await firstValueFrom(store.dispatch(new VolumeTags.Create(createModel)));

      expect(createVolumeTagUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createVolumeTagUseCase.execute).toHaveBeenCalledWith(createModel);

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.volumeTags).toHaveLength(1);
      expect(state.volumeTags[0].label).toBe('New Volume Tag');
      expect(state.seriesTags).toEqual([]);
    });

    it('should not affect seriesTags when creating volume tag', async () => {
      const createModel = new CreateVolumeTagModel({ label: 'New Volume Tag' });

      await firstValueFrom(store.dispatch(new VolumeTags.Create(createModel)));

      const seriesTags = store.selectSnapshot(TagsStateSelectors.seriesTags);
      expect(seriesTags).toEqual([]);
    });

    it('should not add tag if use case returns null', async () => {
      createVolumeTagUseCase.execute.mockResolvedValueOnce(null);
      const createModel = new CreateVolumeTagModel({ label: 'New Volume Tag' });

      await firstValueFrom(store.dispatch(new VolumeTags.Create(createModel)));

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.volumeTags).toEqual([]);
    });
  });

  describe('deleteVolumeTag', () => {
    it('should execute Delete use-case and remove volume tag from state', async () => {
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      await firstValueFrom(store.dispatch(new VolumeTags.Delete(mockVolumeTag.id)));

      expect(deleteVolumeTagUseCase.execute).toHaveBeenCalledTimes(1);
      expect(deleteVolumeTagUseCase.execute).toHaveBeenCalledWith(mockVolumeTag.id);

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.volumeTags).toEqual([]);
      expect(state.seriesTags).toEqual([]);
    });

    it('should not affect seriesTags when deleting volume tag', async () => {
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      await firstValueFrom(store.dispatch(new VolumeTags.Delete(mockVolumeTag.id)));

      const seriesTags = store.selectSnapshot(TagsStateSelectors.seriesTags);
      expect(seriesTags).toEqual([]);
    });

    it('should not remove tag if use case returns false', async () => {
      deleteVolumeTagUseCase.execute.mockResolvedValueOnce(false);
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      await firstValueFrom(store.dispatch(new VolumeTags.Delete(mockVolumeTag.id)));

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.volumeTags).toEqual(mockVolumeTags);
    });
  });

  describe('cross-domain isolation', () => {
    it('should maintain isolation between series and volume tags when creating series tag', async () => {
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      const createModel = new CreateSeriesTagModel({ label: 'New Series Tag' });
      await firstValueFrom(store.dispatch(new SeriesTags.Create(createModel)));

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.seriesTags).toHaveLength(1);
      expect(state.volumeTags).toEqual(mockVolumeTags);
    });

    it('should maintain isolation between series and volume tags when deleting series tag', async () => {
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      await firstValueFrom(store.dispatch(new SeriesTags.Delete(mockSeriesTag.id)));

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.seriesTags).toEqual([]);
      expect(state.volumeTags).toEqual(mockVolumeTags);
    });

    it('should maintain isolation between series and volume tags when creating volume tag', async () => {
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));

      const createModel = new CreateVolumeTagModel({ label: 'New Volume Tag' });
      await firstValueFrom(store.dispatch(new VolumeTags.Create(createModel)));

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.volumeTags).toHaveLength(1);
      expect(state.seriesTags).toEqual(mockSeriesTags);
    });

    it('should maintain isolation between series and volume tags when deleting volume tag', async () => {
      await firstValueFrom(store.dispatch(new SeriesTags.GetAll()));
      await firstValueFrom(store.dispatch(new VolumeTags.GetAll()));

      await firstValueFrom(store.dispatch(new VolumeTags.Delete(mockVolumeTag.id)));

      const state = store.selectSnapshot(TagsStateSelectors.stateModel);
      expect(state.volumeTags).toEqual([]);
      expect(state.seriesTags).toEqual(mockSeriesTags);
    });
  });
});

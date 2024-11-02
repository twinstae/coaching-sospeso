import type { Sospeso } from './domain';

type SospesoListItemDto = {
    id: string;
    from: string;
    to: string;
}

export interface SospesoRepositoryI  {
    retrieveSospesoList(): Promise<SospesoListItemDto[]>;
    updateOrSave(sospesoId: string, update: (sospeso: Sospeso | undefined) => Sospeso): Promise<void>;
}

export const createFakeRepository = (initState: Record<string, Sospeso> = {}): SospesoRepositoryI => {
    let _fakeState = initState

    return {
        async retrieveSospesoList(): Promise<SospesoListItemDto[]>{
            return Object.values(_fakeState).map(sospeso => ({
                from: sospeso.from,
                to: sospeso.to,
                id: sospeso.id
            }))
        },
        async updateOrSave(sospesoId: string, update: (sospeso: Sospeso | undefined) => Sospeso): Promise<void>{
            _fakeState[sospesoId] = update(_fakeState[sospesoId])
        }
    }
}

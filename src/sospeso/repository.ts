import type { Sospeso } from './domain';

type SospesoListItemDto = {
    id: string;
    from: string;
    to: string;
}

let _fakeState: Record<string, Sospeso> = {}

export const fakeRepository = {
    async retrieveSospesoList(): Promise<SospesoListItemDto[]>{
        return Object.values(_fakeState).map(sospeso => ({
            from: sospeso.from,
            to: sospeso.to,
            id: sospeso.id
        }))
    },
    async save(sospeso: Sospeso): Promise<void>{
        _fakeState[sospeso.id] = sospeso;
    }
}

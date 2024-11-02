
type SospesoIssuing = {
    id: string;

    issuedAt: Date;
}

type SospesoApplication = {
    id: string;

    appliedAt: Date;
}

type SospesoUsing = {
    id: string;

    usedAt: Date;
}

type Sospeso = {
    id: string;
    issuing: SospesoIssuing;
    applicationList: SospesoApplication[]
    using: SospesoUsing | undefined;
}

type SospesoApplicationCommand = {
    sospesoId: string;
}

function issueSospeso(command: SospesoApplicationCommand): Sospeso {

    return {
        id: command.sospesoId,
        using: undefined
    }
}

function isUsed(sospeso: Sospeso) {
    return sospeso.using !== undefined;
}

export enum ConstraintEnum {
    IsPhoneNumber = "numero di cellulare non valido",
    Marches = "$property non soddisfa tutte le condizioni",
    IsEmail = "$property non è valida come email",
    Length = "Lunghezza minima $constraint1 lunghezza massima $constraint2",
    Min = "La quantità minima deve essere uguale o maggiore di $constraint1",
    Max = "La quantità massima deve essere uguale o minore di $constraint1"
}
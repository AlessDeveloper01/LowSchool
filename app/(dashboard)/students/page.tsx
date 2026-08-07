import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { StudentsManager } from "@/features/students/components/StudentsManager";
import { StudentService } from "@/features/students/services/StudentService";

export const metadata: Metadata = { title: "Alumnos" };
export const dynamic = "force-dynamic";

export default async function StudentsPage() {
	const currentUser = await AuthService.getSessionUser();
	if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")) {
		redirect("/dashboard");
	}

	const [students, options] = await Promise.all([
		StudentService.findAll().then((rows) => rows.map((row) => ({
			id: row.id,
			nombre: row.nombre,
			apellidos: row.apellidos,
			matricula: row.matricula,
			sexo: row.sexo,
			edad: row.fechaNacimiento ? calculateAge(row.fechaNacimiento) : null,
			tecnologia: row.tecnologia,
			direccion: row.direccion,
			curp: row.curp,
			fechaNacimiento: row.fechaNacimiento?.toISOString() ?? null,
			telefonoResponsable: row.telefonoResponsable,
			nombreResponsable: row.nombreResponsable,
			groups: row.inscripciones.map((inscription) => ({
				inscriptionId: inscription.id,
				groupId: inscription.grupo.id,
				groupLabel: `${inscription.grupo.grado}° ${inscription.grupo.letra}`,
				schoolYear: inscription.grupo.cicloEscolar.nombre,
				repetidor: inscription.repetidor,
			})),
		}))),
		StudentService.listOptions(),
	]);

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<StudentsManager students={students} options={options} />
		</div>
	);
}

function calculateAge(date: Date): number | null {
	const today = new Date();
	let age = today.getFullYear() - date.getFullYear();
	if (today.getMonth() < date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())) age -= 1;
	return age >= 0 ? age : null;
}

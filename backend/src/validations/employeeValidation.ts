import { z } from 'zod';

export const createEmployeeSchema = z.object({
    body: z.object({
        name: z.string()
            .min(1, 'O nome é obrigatório.' )
            .min(3, 'O nome deve ter no mínimo 3 caracteres.'),

        email: z.string()
        .min(1, 'O e-mail é obrigatório.' )
        .email({ message: 'Formato de e-mail inválido.' }),

        password: z.string()
        .min(1, 'A senha é obrigatória.' )
        .min(6, 'A senha deve ter no mpinimo 6 caracteres.' ),
        
        hiring_date: z.string()
        .min(1, 'A data de entrada na equipe é obrigatporia.' )
        .datetime({ message: 'A data deve ser válida.' }),
        
        position_id: z.string()
        .min(1, 'O ID do cargo é obrigatório.' )
        .uuid({ message: 'O ID do cargo deve ser válido.' }),
        
        department_id: z.string()
        .min(1, 'O ID do departamento é obrigatório.')
        .uuid({ message: 'O Id do departamento deve ser válido.' }),
        
        cellphone: z.string().optional(),
        birth_date: z.string().datetime().optional(),
        address: z.string().optional(),
        supervisor_id: z.string().uuid().optional(),
    }),
});

export const updateEmployeeSchema = z.object({
    params: z.object({
        id: z.string()
        .min(1, 'O ID do usuário é obrigatório.' )
        .uuid({ message: 'O Id do usuário deve ser válido.' }),
    }),
    body: z.object({
        name: z.string().min(3).optional(),
        email: z.string().email().optional(),
        cellphone: z.string().optional(),
        birth_date: z.string().datetime().optional(),
        address: z.string().optional(),
        position_id: z.string().uuid().optional(),
        department_id: z.string().uuid().optional(),
        supervisor_id: z.string().uuid().optional(),
        is_active: z.boolean().optional(),
    }).refine((data) => {
        
        return Object.keys(data).length > 0
    }, {
        
        message: 'Pelo menos um campo deve ser fornecido para atualização.' 
    })
});

export const getEmployeesSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive('A página deve ser um número positivo.').default(1),
        limit: z.coerce.number().int('O limite deve ser um número positivo.').positive().default(10)
    }),
});
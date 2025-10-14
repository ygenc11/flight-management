using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace FlightManagement.Repositories
{
    /// <summary>
    /// Generic repository interface for common CRUD operations
    /// </summary>
    /// <typeparam name="T">Entity type</typeparam>
    public interface IRepository<T> where T : class
    {
        /// <summary>
        /// Gets all entities
        /// </summary>
        Task<IEnumerable<T>> GetAllAsync();

        /// <summary>
        /// Gets entity by ID
        /// </summary>
        Task<T?> GetByIdAsync(int id);

        /// <summary>
        /// Finds entities matching the predicate
        /// </summary>
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// Adds a new entity
        /// </summary>
        Task<T> AddAsync(T entity);

        /// <summary>
        /// Updates an existing entity
        /// </summary>
        Task UpdateAsync(T entity);

        /// <summary>
        /// Deletes an entity
        /// </summary>
        Task DeleteAsync(T entity);

        /// <summary>
        /// Checks if entity exists matching the predicate
        /// </summary>
        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// Counts entities matching the predicate
        /// </summary>
        Task<int> CountAsync(Expression<Func<T, bool>> predicate);
    }
}

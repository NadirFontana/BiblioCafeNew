import './index.css';

export default function HomePage() {
  return (
    <div className="page-wrapper">
      {/* Header */}
      <header>
        <img 
          src="/img/pillar.png" 
          alt="" 
          className="column-left"
        />
        <img 
          src="/img/pillar.png" 
          alt="" 
          className="column-right"
        />
        
        <img
          src="/img/logo.png"
          alt="BiblioCafè Logo"
          className="header-logo"
        />
      </header>

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <button className="nav-button active" data-category="colazioni">
            Colazioni
          </button>
          <button className="nav-button" data-category="snack">
            Snack
          </button>
          <button className="nav-button" data-category="caffetteria">
            Caffetteria
          </button>
          <button className="nav-button" data-category="aperitivi">
            Aperitivi
          </button>
          <button className="nav-button" data-category="cocktails">
            Cocktails
          </button>
          <button className="nav-button" data-category="soft-drinks">
            Soft Drinks
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <div className="category active" data-category="colazioni">
          <h2 className="category-title">Colazioni</h2>
          <div className="menu-grid">
            <div className="item">
              <div className="item-name">Cornetto Semplice</div>
              <div className="item-description">
                Cornetto appena sfornato, fragrante e dorato
              </div>
              <div className="item-price">€1.50</div>
            </div>
            
            <div className="item">
              <div className="item-name">Cornetto alla Crema</div>
              <div className="item-description">
                Cornetto ripieno di cremosa crema pasticcera
              </div>
              <div className="item-price">€2.00</div>
            </div>
            
            <div className="item">
              <div className="item-name">Cornetto alla Marmellata</div>
              <div className="item-description">
                Cornetto con marmellata di albicocche di prima qualità
              </div>
              <div className="item-price">€2.00</div>
            </div>
            
            <div className="item">
              <div className="item-name">Brioche Integrale</div>
              <div className="item-description">
                Brioche preparata con farina integrale, sana e gustosa
              </div>
              <div className="item-price">€2.20</div>
            </div>
            
            <div className="item">
              <div className="item-name">Muffin ai Frutti di Bosco</div>
              <div className="item-description">
                Soffice muffin con mirtilli e lamponi freschi
              </div>
              <div className="item-price">€2.80</div>
            </div>
            
            <div className="item">
              <div className="item-name">Yogurt con Granola</div>
              <div className="item-description">
                Yogurt greco con granola croccante e miele
              </div>
              <div className="item-price">€3.50</div>
            </div>
          </div>
        </div>

        <div className="category" data-category="snack">
          <h2 className="category-title">Snack</h2>
          <div className="menu-grid">
            <div className="item">
              <div className="item-name">Panino Prosciutto e Mozzarella</div>
              <div className="item-description">
                Panino con prosciutto crudo e mozzarella di bufala
              </div>
              <div className="item-price">€4.50</div>
            </div>
            
            <div className="item">
              <div className="item-name">Toast al Prosciutto</div>
              <div className="item-description">
                Toast tostato con prosciutto cotto e formaggio
              </div>
              <div className="item-price">€3.50</div>
            </div>
            
            <div className="item">
              <div className="item-name">Focaccia con Pomodoro</div>
              <div className="item-description">
                Focaccia calda con pomodoro fresco e basilico
              </div>
              <div className="item-price">€3.00</div>
            </div>
          </div>
        </div>

        <div className="category" data-category="caffetteria">
          <h2 className="category-title">Caffetteria</h2>
          <div className="menu-grid">
            <div className="item">
              <div className="item-name">Espresso</div>
              <div className="item-description">
                Il classico caffè espresso italiano
              </div>
              <div className="item-price">€1.20</div>
            </div>
            
            <div className="item">
              <div className="item-name">Cappuccino</div>
              <div className="item-description">
                Espresso con latte montato e schiuma cremosa
              </div>
              <div className="item-price">€1.80</div>
            </div>
            
            <div className="item">
              <div className="item-name">Caffè Americano</div>
              <div className="item-description">
                Espresso allungato con acqua calda
              </div>
              <div className="item-price">€2.00</div>
            </div>
            
            <div className="item">
              <div className="item-name">Latte Macchiato</div>
              <div className="item-description">
                Latte caldo con espresso e schiuma di latte
              </div>
              <div className="item-price">€2.50</div>
            </div>
          </div>
        </div>

        <div className="category" data-category="aperitivi">
          <h2 className="category-title">Aperitivi</h2>
          <div className="menu-grid">
            <div className="item">
              <div className="item-name">Spritz</div>
              <div className="item-description">
                Aperol, Prosecco, seltz e arancia
              </div>
              <div className="item-price">€5.00</div>
            </div>
            
            <div className="item">
              <div className="item-name">Negroni</div>
              <div className="item-description">
                Gin, Campari e Vermouth rosso
              </div>
              <div className="item-price">€6.00</div>
            </div>
            
            <div className="item">
              <div className="item-name">Aperol Spritz</div>
              <div className="item-description">
                Il classico aperitivo veneto
              </div>
              <div className="item-price">€4.50</div>
            </div>
          </div>
        </div>

        <div className="category" data-category="cocktails">
          <h2 className="category-title">Cocktails</h2>
          <div className="menu-grid">
            <div className="item">
              <div className="item-name">Mojito</div>
              <div className="item-description">
                Rum bianco, menta fresca, lime e soda
              </div>
              <div className="item-price">€7.00</div>
            </div>
            
            <div className="item">
              <div className="item-name">Caipirinha</div>
              <div className="item-description">
                Cachaça, lime e zucchero di canna
              </div>
              <div className="item-price">€6.50</div>
            </div>
            
            <div className="item">
              <div className="item-name">Cosmopolitan</div>
              <div className="item-description">
                Vodka, Cointreau, succo di lime e mirtilli
              </div>
              <div className="item-price">€8.00</div>
            </div>
          </div>
        </div>

        <div className="category" data-category="soft-drinks">
          <h2 className="category-title">Soft Drinks</h2>
          <div className="menu-grid">
            <div className="item">
              <div className="item-name">Coca Cola</div>
              <div className="item-description">
                La classica cola rinfrescante
              </div>
              <div className="item-price">€2.50</div>
            </div>
            
            <div className="item">
              <div className="item-name">Aranciata</div>
              <div className="item-description">
                Bibita all'arancia naturale
              </div>
              <div className="item-price">€2.50</div>
            </div>
            
            <div className="item">
              <div className="item-name">Acqua Naturale</div>
              <div className="item-description">
                Acqua minerale naturale 0.5L
              </div>
              <div className="item-price">€1.50</div>
            </div>
            
            <div className="item">
              <div className="item-name">Succo di Frutta</div>
              <div className="item-description">
                Succo di frutta fresco (pesca, pera, albicocca)
              </div>
              <div className="item-price">€3.00</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <p>© 2024 BiblioCafè - Tutti i diritti riservati</p>
      </footer>
    </div>
  );
}
